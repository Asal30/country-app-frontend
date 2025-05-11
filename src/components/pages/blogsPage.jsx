import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SortAndSearch from "../common/sortAndSearch/sortAndSearch";

function BlogsPage({ token, userId }) {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
          onClick={() => navigate("/addBlog")}
          className="bg-primary-600 text-primary-100 px-4 py-2 rounded-lg hover:bg-primary-700 transition"
        >
          Add New Blog
        </button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="backdrop-blur bg-black bg-opacity-20 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
              <div>
                <h2 className="text-xl font-bold text-primary-800">
                  {post.title}
                </h2>
                <p className="text-primary-600 text-sm mt-2 h-10">
                  {post.description}
                </p>
                <div className="flex justify-between items-center mt-4 text-primary-700 text-sm">
                  <span>Likes: {post.likes}</span>
                  <span>Comments: {post.comments}</span>
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => navigate(`/editBlog/${post.id}`)}
                    className="text-primary-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BlogsPage;