import { useState, useEffect } from "react";
import axios from "axios";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllBlogs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/blogs`);
        if (response.data && response.data.length > 0) {
          setPosts(response.data);
          setFilteredPosts(response.data); // Cache the blogs for filtering
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

    fetchAllBlogs();
  }, []);

  const sortPosts = (option) => {
    let sortedPosts = [...filteredPosts];
    if (option === "newest") {
      sortedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (option === "mostLiked") {
      sortedPosts.sort((a, b) => b.likes - a.likes);
    } else if (option === "mostCommented") {
      sortedPosts.sort((a, b) => b.comments - a.comments);
    }
    setFilteredPosts(sortedPosts);
    setSortOption(option);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.country.toLowerCase().includes(query)
    );
    setFilteredPosts(filtered);
  };

  return (
      <div className="min-h-screen p-6">
        {/* Header Row */}
          <div className="w-full flex justify-between px-[6%] items-center mt-6 mb-14">
            {/* Filters */}
            <div className="flex space-x-4">
              <button
                onClick={() => sortPosts("newest")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  sortOption === "newest" ? "bg-primary-600 text-primary-100" : "bg-black bg-opacity-20 text-primary-900 border-[1px] border-[#1ea8a1]"
                }`}
              >
                Newest
              </button>
              <button
                onClick={() => sortPosts("mostLiked")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  sortOption === "mostLiked" ? "bg-primary-600 text-primary-100" : "bg-black bg-opacity-20 text-primary-900 border-[1px] border-[#1ea8a1]"
                }`}
              >
                Most Liked
              </button>
              <button
                onClick={() => sortPosts("mostCommented")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  sortOption === "mostCommented" ? "bg-primary-600 text-primary-100" : "bg-black bg-opacity-20 text-primary-900 border-[1px] border-[#1ea8a1]"
                }`}
              >
                Most Commented
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex items-center justify-center w-[400px]">
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={handleSearch}
                className="placeholder:text-primary-900 text-primary-900 bg-black bg-opacity-20 border-[1px] border-[#1ea8a1] px-4 py-2 rounded-lg w-[80%]"
              />
            </div>
          </div>
          {/* Welcome Message */}
          <div className="flex-col text-center my-[11%]">
              <h1 className="text-4xl font-bold text-primary-900 ">Welcome to the Country Blog</h1>
              <p className="text-primary-800 text-lg mt-2">
                Explore recent and popular blog posts about countries around the world.
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
                <img src={post.image} alt={post.title} className="w-full h-48 object-cover rounded-lg mb-2" />
                <div>
                  <h2 className="text-xl font-bold text-primary-800">{post.title}</h2>
                  <p className="text-primary-600 text-sm mt-2 h-10">{post.description}</p>
                  <div className="flex justify-between items-center mt-4 text-primary-700 text-sm">
                    <span>Likes: {post.likes}</span>
                    <span>Comments: {post.comments}</span>
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
  );
}