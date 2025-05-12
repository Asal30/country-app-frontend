import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SortAndSearch from "../common/sortAndSearch/sortAndSearch";
import axios from "axios";

function BlogsPage({ token, userId }) {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    description: "",
    country: "",
    date: "",
    images: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [photoPreviews, setPhotoPreviews] = useState([]);

  useEffect(() => {
    if (!token) {
      const userResponse = window.confirm(
        "User not logged in. Please log in to use this feature."
      );
      if (userResponse) {
        navigate("/login");
      } else {
        navigate("/");
      }
      return;
    }

    const fetchUserBlogs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/blogs/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data && response.data.length > 0) {
          setPosts(response.data);
          setFilteredPosts(response.data);
          setError("");
        } else {
          setPosts([]);
          setFilteredPosts([]);
          setError("No blogs found.");
        }
      } catch (err) {
        setError("Failed to fetch blogs. Please try again later.");
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBlogs();
  }, [token, userId, navigate]);

  const handleEdit = (id) => {
    if (!id) {
      setError("Invalid blog ID.");
      return;
    }
    fetchBlogById(id);
  };

  const handleUpdate = async (id, data) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/blogs/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === id ? data : post)) // Replace the updated post in the list
      );

      setError("");
    } catch (err) {
      setError("Failed to update the blog. Please try again.");
      console.error("Error updating blog:", err);
    }
  };

  const handleDelete = async (blogId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/blogs/${blogId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts(posts.filter((post) => post.id !== blogId));
      setFilteredPosts(filteredPosts.filter((post) => post.id !== blogId));
    } catch (err) {
      console.error("Error deleting blog:", err);
      alert("Failed to delete the blog. Please try again.");
    }
  };

  const fetchBlogById = async (id) => {
    console.log("Fetching blog with ID:", id);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setFormData(response.data);
        setIsEditing(true);
        setIsModalOpen(true);
      } else {
        setError("Blog not found.");
      }
    } catch (err) {
      setError("Failed to fetch the blog. Please try again.");
      console.error("Error fetching blog by ID:", err);
    }
  };

  const handleCreate = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("country", data.country);
    formData.append("date", data.date);

    if (data.photos) {
      data.photos.forEach((photo) => formData.append("photos", photo));
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/blogs`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Blog created:", response.data);
    } catch (err) {
      console.error("Error creating blog:", err);
      setError("Failed to create the blog. Please try again.");
    }
  };

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, photos: files });

    const previews = files.map((file) => URL.createObjectURL(file));
    setPhotoPreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await handleUpdate(formData.id, formData);
      } else {
        await handleCreate(formData);
      }

      setFormData({ id: null, title: "", description: "", country: "", date: "", photos: [] });
      setPhotoPreviews([]);
      setIsEditing(false);
      setIsModalOpen(false);
    } catch (err) {
      setError("Failed to save the post. Please try again.");
      console.error("Error saving post:", err);
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Page Header */}
      <div className="flex justify-center items-center mb-6">
        <h1 className="text-3xl font-bold text-primary-800">My Blogs</h1>
      </div>

      {/* Sort and Search Component */}
      <SortAndSearch posts={posts} setFilteredPosts={setFilteredPosts} />
      <div className="flex justify-center items-center mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 text-primary-100 px-4 py-2 rounded-lg hover:bg-primary-700 transition"
        >
          Add New Blog
        </button>
      </div>
      {/* Error Message */}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
            <h2 className="text-lg font-semibold text-red-600 mb-2">Error</h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              onClick={() => setError(null)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Blog Posts */}
      {loading ? (
        <p className="text-center text-primary-600">Loading blogs...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 m-14">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="backdrop-blur bg-black bg-opacity-20 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
            >
              <img src={post.image} alt={post.title} className="w-full h-48 object-cover rounded-lg mb-2"/>
              <div>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-primary-800">{post.title}</h2>
                  <p className="text-primary-600 text-sm">{post.country}</p>
                </div>
                <p className="text-primary-600 text-sm mt-2 h-10">{post.description}</p>
                <div className="flex justify-between items-center mt-4 text-primary-700 text-sm">
                  <span>Likes: {post.likes}</span>
                  <span>Comments: {post.comments}</span>
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleEdit(post.id)}
                    className="bg-[#c2bf27] hover:bg-[#b1ae1c] text-white text-xs px-2 py-1 rounded-xl"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded-xl"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Blog Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="backdrop-blur bg-white bg-opacity-10 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? "Edit Blog Post" : "Add New Blog Post"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-primary-800 font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="placeholder:text-primary-900-opacity-50 text-primary-900 bg-black bg-opacity-20 w-full p-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-primary-800 font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="placeholder:text-primary-900-opacity-50 text-primary-900 bg-black bg-opacity-20 w-full p-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows="4"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-primary-800 font-medium mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="placeholder:text-primary-900-opacity-50 text-primary-900 bg-black bg-opacity-20 w-full p-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-primary-800 font-medium mb-2">
                  Date of Visit
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="placeholder:text-primary-900-opacity-50 text-primary-900 bg-black bg-opacity-20 w-full p-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-primary-800 font-medium mb-2">
                  Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  name="images"
                  multiple
                  onChange={handlePhotoChange}
                  className="placeholder:text-primary-900-opacity-50 text-primary-900 bg-black bg-opacity-20 w-full p-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {photoPreviews.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-1 rounded-lg mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-primary-100 px-4 py-1 rounded-lg"
                >
                  {isEditing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogsPage;