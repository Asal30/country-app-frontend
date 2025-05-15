import { useState, useEffect } from "react";
import axios from "axios";
import SortAndSearch from "../common/sortAndSearch/sortAndSearch";
import LikeButton from "../common/likeButton/likeButton";
import { GoComment } from "react-icons/go";

export default function HomePage({ token, userId }) {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    country: "",
    date: "",
    image: "",
    userId: "",
  });
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    fetchAllBlogsWithUser();
  }, []);

  const fetchAllBlogsWithUser = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/blogs/with-user`
        );
        if (response.data && response.data.length > 0) {
          setPosts(response.data);
          setFilteredPosts(response.data);
          setError("");
          console.log("Fetched blogs:", response.data);
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
  const handleCreate = async (data) => {
    const blogData = new FormData();
    blogData.append("title", data.title);
    blogData.append("description", data.description);
    blogData.append("country", data.country);
    blogData.append("date", data.date);
    blogData.append("image", data.image); // should be a File object
    blogData.append("userId", userId);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/blogs`,
        blogData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPosts((prevPosts) => [...prevPosts, response.data.blog]);
      setFilteredPosts((prevPosts) => [...prevPosts, response.data.blog]);
      setError("");
      fetchAllBlogsWithUser();
    } catch (err) {
      setError("Failed to create the blog. Please try again.");
      console.error("Error creating blog:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      setFormData({ ...formData, image: files[0] });
      setPhotoPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Creating new blog with data:", formData);
      await handleCreate(formData);

      setFormData({
        title: "",
        description: "",
        country: "",
        date: "",
        image: "",
        userId: "",
      });
      setPhotoPreview("");
      setIsModalOpen(false);
    } catch (err) {
      setError("Failed to save the post. Please try again.");
      console.error("Error saving post:", err);
    }
  };

  return (
    <>
      <div className="min-h-screen p-6">
        {/* Sort and Search Component */}
        <SortAndSearch posts={posts} setFilteredPosts={setFilteredPosts} />

        {/* Welcome Message */}
        <div className="flex-col text-center mb-[10%]">
          <div className="flex justify-center items-center mb-[4%]">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary-600 text-primary-100 px-4 py-2 rounded-lg hover:bg-primary-700 transition"
            >
              Add New Blog
            </button>
          </div>
          <h1 className="text-4xl font-bold text-primary-900 ">
            Welcome to the Country Blog
          </h1>
          <p className="text-primary-800 text-lg mt-2">
            Explore recent and popular blog posts about countries around the
            world.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-center text-red-600 mb-4">
            <p>{error}</p>
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
                {/* User Profile Image and Name */}
                <div
                  className="flex items-center mb-4 cursor-pointer"
                  onClick={() =>
                    (window.location.href = `/user/${post.user_id}`)
                  }
                >
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}${post.user_profile_image}`}
                    alt={post.user_name}
                    className="w-10 h-10 border-[1px] border-primary-400 rounded-full mr-2 object-cover"
                  />
                  <div>
                    <h3 className="text-primary-800 font-semibold hover:underline">
                      {post.user_name}
                    </h3>
                    <p className="text-primary-600 text-sm">
                      {new Date(post.date).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}${post.image}`}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-lg mb-2"
                />
                <div>
                  <h2
                    className="text-xl font-bold text-primary-800 hover:underline cursor-pointer"
                    onClick={() => (window.location.href = `/blog/${post.id}`)}
                  >
                    {post.title}
                  </h2>
                  <p className="text-primary-600 text-sm mt-2 h-10">
                    {post.description}
                  </p>
                  <div className="flex justify-between items-center mt-4 text-primary-700 text-sm">
                    {/* Like Button */}
                    <LikeButton
                      blogId={post.id}
                      userId={userId}
                      initialLikes={post.likes}
                    />
                    <div
                      className="flex items-center gap-4 cursor-pointer"
                      onClick={() =>
                        (window.location.href = `/blog/${post.id}`)
                      }
                    >
                      <GoComment className="text-primary-600 text-xl font-bold hover:text-primary-800" />
                      {post.comments}
                    </div>
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
              <h2 className="text-xl font-bold mb-4">Add New Blog Post</h2>
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
                    Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    multiple
                    onChange={handleChange}
                    className="placeholder:text-primary-900-opacity-50 text-primary-900 bg-black bg-opacity-20 w-full p-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {photoPreview && (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    )}
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
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
