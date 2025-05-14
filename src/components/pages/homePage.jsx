import { useState, useEffect } from "react";
import axios from "axios";
import SortAndSearch from "../common/sortAndSearch/sortAndSearch";
import LikeButton from "../common/likeButton/likeButton";
import { GoComment } from "react-icons/go";

export default function HomePage({ token, userId }) {
  const [posts, setPosts] = useState([]);

  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
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

    fetchAllBlogsWithUser();
  }, []);

  return (
    <>
      <div className="min-h-screen p-6">
        {/* Sort and Search Component */}
        <SortAndSearch posts={posts} setFilteredPosts={setFilteredPosts} />

        {/* Welcome Message */}
        <div className="flex-col text-center my-[11%]">
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
                    src={post.user_profile_image}
                    alt={post.user_name}
                    className="w-10 h-10 rounded-full mr-2"
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
                  src={post.image}
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
                    {token && (
                      <LikeButton
                        blogId={post.id}
                        userId={userId}
                        initialLikes={post.likes}
                      />
                    )}
                    <div className="flex items-center gap-4">
                      <GoComment className="text-primary-600 text-xl font-bold" />
                      {post.comments}
                    </div>
                    <span>
                      {new Date(post.date).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
