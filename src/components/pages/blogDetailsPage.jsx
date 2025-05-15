import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import LikeButton from "../common/likeButton/likeButton";
import { GoComment } from "react-icons/go";

function BlogDetailsPage({ token, userId }) {
  const { blogId } = useParams(); // Get the blog ID from the route
  const [blog, setBlog] = useState(null);
  const [country, setCountry] = useState([null]);
  const [comments, setComments] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      const userResponse = window.confirm(
        "User not logged in. Please log in to use this feature."
      );
      console.log(userResponse);
      if (userResponse) {
        navigate("/login");
      } else {
        navigate("/");
      }
      return;
    }
    fetchBlogDetails();
    fetchComments();
  }, [blogId]);

  const fetchBlogDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/blogs/${blogId}/with-user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBlog(response.data);
    } catch (err) {
      setError("Failed to fetch blog details.");
      console.error("Error fetching blog details:", err);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/comments/${blogId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments(response.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const fetchCountryDetails = async () => {
    console.log(blog.country);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/countries/${blog.country}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCountry(response.data);
      setClicked(true);
    } catch (err) {
      console.error("Error fetching country details:", err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/comments`,
        { blogId, userId, comment: newComment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments((prev) => [response.data, ...prev]);
      setNewComment(null);
      fetchBlogDetails();
      fetchComments();
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  if (!blog) {
    return (
      <div className="min-h-screen bg-black bg-opacity-80 flex items-center justify-center">
        <p className="text-center text-primary-600">Loading blog details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
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

      <div className="w-[50%] mx-auto backdrop-blur p-12 bg-black bg-opacity-20 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        {/* Blog Title */}
        <h1 className="text-4xl font-bold text-primary-900 mb-12 ">
          {blog.title}
        </h1>
        <div className="flex items-center justify-between mb-6">
          <div>
            {/* User Box */}
            <div className="flex items-center">
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}${blog.user_profile_image}`}
                alt={blog.user_name}
                className="w-12 h-12 border-[1px] border-primary-400 rounded-full mr-4 object-cover"
              />
              <div>
                <h3 className="text-primary-800 font-semibold">
                  {blog.user_name}
                </h3>
                <p className="text-primary-600 text-sm">
                  {new Date(blog.created_at).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Country Box */}
          <div className="px-4 py-2 border rounded-lg shadow-md bg-white bg-opacity-10 border-primary-300 overflow- max-w-[330px] max-h-30">
            {!clicked && (
              <button
                onClick={() => fetchCountryDetails()}
                className="h-20 text-primary-700 font-semibold"
              >
                Click to view country details
              </button>
            )}
            {clicked && (
              <div className="flex items-center justify-between">
                <img
                  src={country.flag}
                  alt={country.name}
                  className="w-20 h-14 rounded-md object-cover mr-4"
                />

                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-primary-600">
                    {country.name}
                  </h3>
                    <p className="text-sm text-primary-500 font-medium">
                      Capital : <span className="font-normal text-primary-600">{country.capital}</span>
                    </p>
                    <p className="text-sm text-primary-500 font-medium">
                      Currency : <span className="font-normal text-primary-600">{country.currency}</span>
                    </p>
                  <p className="text-sm text-primary-500 font-medium">
                    Languages : <span className="font-normal text-primary-600">{country.languages[0]} {country.languages[1]} {country.languages[2]}</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Blog Image */}
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}${blog.image}`}
          alt={blog.title}
          className="w-full h-96 object-cover border-[1px] border-primary-400 rounded-lg mb-6"
        />

        {/* Blog Description */}
        <p className="text-primary-700 text-lg mb-6">{blog.description}</p>

        {/* Likes and Comments Count */}

        <div className="w-[15%] flex items-center justify-between mb-6">
          <LikeButton
            blogId={blog.id}
            userId={userId}
            initialLikes={blog.likes}
          />
          <div className="flex items-center gap-4">
            <GoComment className="text-primary text-xl" />
            {blog.comments}
          </div>
        </div>

        {/* Comments Section */}
        <h2 className="text-2xl font-bold border-t border-primary-400 text-primary-800 mt-12 pt-8 mb-4">
          Comments
        </h2>

        {/* Add Comment */}
        {token && (
          <div className="mb-8 flex flex-col pb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="p-3 placeholder:text-primary-900 text-primary-900 bg-black bg-opacity-20 border-[1px] border-primary-400 px-4 py-2 rounded-lg mb-4"
              rows="4"
            ></textarea>
            <button
              onClick={handleCommentSubmit}
              className="bg-primary-600 hover:bg-primary-700 text-primary-100 font-semibold px-4 py-2 rounded-lg w-40"
            >
              Post Comment
            </button>
          </div>
        )}
        {/* Display Comments */}
        <div className="max-h-96 overflow-y-auto">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="mb-4 p-4 border border-primary-300 rounded-lg"
            >
              {/* User Box */}
              <div className="flex items-center">
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}${comment.user_profile_image}`}
                  alt={comment.user_name}
                  className="w-8 h-8 border-[1px] border-primary-400 object-cover rounded-full mr-4"
                />
                <div>
                  <h3 className="text-primary-700 text-md">
                    {comment.user_name}
                  </h3>
                  <p className="text-primary-500 text-xs">
                    {new Date(blog.created_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <p className="text-primary-900 mt-2">{comment.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BlogDetailsPage;
