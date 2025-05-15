import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { FaRegFileAlt, FaRegHeart, FaRegCommentDots, FaStar } from "react-icons/fa";
import axios from "axios";

export default function UserProfilePage({
  token,
  logout,
  userId: loggedInUserId,
}) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [activeTab, setActiveTab] = useState("summary");
  const [stats, setStats] = useState({
    blogs: 0,
    likes: 0,
    comments: 0,
    mostLikedBlog: null,
  });
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });
  const [passwordMsg, setPasswordMsg] = useState("");

  // Fetch user info and stats
  useEffect(() => {
    fetchUser();
    fetchStats();
    fetchFollowers();
    fetchFollowings();
  }, [userId]);

  const fetchUser = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setUser(res.data);
    setEditData({
      username: res.data.username,
      bio: res.data.bio,
      city: res.data.city,
      profile_image: res.data.profile_image,
    });
  };
  const fetchStats = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/stats`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setStats({
        blogs: res.data.totalBlogs,
        likes: res.data.totalLikes,
        comments: res.data.totalComments,
        mostLikedBlog: res.data.mostLikedBlog
    });
  };
  const fetchFollowers = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/followers`
    );
    setFollowers(res.data);
  };
  const fetchFollowings = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/followings`
    );
    setFollowings(res.data);
  };

  // Handle edit
  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: files && files.length > 0 ? files[0] : value,
    }));
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    console.log("Edit data :", editData);
    const res = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`,
      editData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(res.data.message);
    setEditMode(false);
    fetchUser();
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg("");
    if (passwords.new !== passwords.confirm) {
      setPasswordMsg("New passwords do not match.");
      return;
    }
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/password`,
        { oldPassword: passwords.old, newPassword: passwords.new },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPasswordMsg("Password changed successfully.");
      setPasswords({ old: "", new: "", confirm: "" });
    } catch (err) {
      setPasswordMsg("Failed to change password.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black bg-opacity-80 flex items-center justify-center">
        <p className="text-center text-primary-600">Loading user details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 flex flex-col items-center mt-16">
      <div className="w-[70%] flex mx-auto backdrop-blur p-12 bg-black bg-opacity-20 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        {/* Left Profile Box */}
        <div className="w-[30%] border-[1px] border-primary-500 rounded-lg shadow-lg p-8 m-8 relative flex flex-col text-center items-center">
          {/* Edit Icon */}
          {loggedInUserId === userId && !editMode && (
            <button
              className="absolute top-4 right-4 text-primary-600 hover:text-primary-800"
              onClick={() => setEditMode(true)}
              title="Edit Profile"
            >
              <FaEdit size={22} />
            </button>
          )}
          {/* Profile Image */}
          <img
            src={user.profile_image}
            alt={user.username}
            className="w-32 h-32 rounded-full border-4 border-primary-300 object-cover mb-4"
          />
          {/* Profile Info */}
          {editMode ? (
            <form
              className="w-full flex flex-col items-center"
              onSubmit={handleEditSubmit}
            >
              <input
                type="file"
                name="profile_image"
                accept="image/*"
                className="mb-2"
                onChange={handleEditChange}
              />
              <input
                type="text"
                name="username"
                value={editData.username}
                onChange={handleEditChange}
                className="mb-2 p-2 placeholder:text-gray-400 text-primary-900 bg-black bg-opacity-20 border-[1px] border-primary-400 rounded w-full"
                placeholder="Username"
                required
              />
              <input
                type="text"
                name="city"
                value={editData.city}
                onChange={handleEditChange}
                className="mb-2 p-2 placeholder:text-gray-400 text-primary-900 bg-black bg-opacity-20 border-[1px] border-primary-400 rounded w-full"
                placeholder="Living City"
              />
              <textarea
                name="bio"
                value={editData.bio}
                onChange={handleEditChange}
                className="mb-2 p-2 placeholder:text-gray-400 text-primary-900 bg-black bg-opacity-20 border-[1px] border-primary-400 rounded w-full"
                placeholder="Bio"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-primary-600 text-primary-100 px-4 py-1 rounded hover:bg-primary-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="bg-gray-300 text-gray-800 px-4 py-1 rounded hover:bg-gray-400"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-primary-900">
                {user.username}
              </h2>
              <p className="text-primary-700 mt-2">{user.bio}</p>
              <p className="text-primary-600 mt-2">Living City : {user.city}</p>
              <p className="text-primary-500 mt-2 text-sm">
                Joined on :{" "}
                {new Date(user.created_at).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              {loggedInUserId === userId ? (
                <button
                  className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={logout}
                >
                  Logout
                </button>
              ) : (
                loggedInUserId && (
                  <button
                    className="mt-6 bg-primary-600 text-primary-100 px-4 py-2 rounded hover:bg-primary-700"
                    onClick={() => navigate(`/user/${loggedInUserId}`)}
                  >
                    View My Profile
                  </button>
                )
                
              )}
            </>
          )}
        </div>

        {/* Right Content Box */}
        <div className="w-[70%] border-[1px] border-primary-500 rounded-lg shadow-lg p-8 m-8">
          {/* Tabs */}
          <div className="flex justify-evenly border-b border-primary-400 mb-6">
            {["summary", "followers", "followings", "change-password"].map(
              (tab) => (
                <button
                  key={tab}
                  className={`px-6 py-2 font-semibold capitalize border-b transition ${
                    activeTab === tab
                      ? "border-primary-600 text-primary-700"
                      : "border-transparent text-primary-500 hover:text-primary-600"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.replace("-", " ")}
                </button>
              )
            )}
          </div>

          {/* Tab Contents */}
          {activeTab === "summary" && (
            <div className="flex flex-col md:flex-row gap-8 w-full">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                <div className="bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl p-6 shadow flex flex-col items-center hover:scale-105 transition-transform">
                  <FaRegFileAlt className="text-4xl text-primary-600 mb-2" />
                  <span className="text-3xl font-bold text-primary-800">{stats.blogs}</span>
                  <span className="text-primary-700 mt-2 font-medium">Total Blogs</span>
                </div>
                <div className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-xl p-6 shadow flex flex-col items-center hover:scale-105 transition-transform">
                  <FaRegHeart className="text-4xl text-pink-500 mb-2" />
                  <span className="text-3xl font-bold text-pink-700">{stats.likes}</span>
                  <span className="text-pink-700 mt-2 font-medium">Total Likes</span>
                </div>
                <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-6 shadow flex flex-col items-center hover:scale-105 transition-transform">
                  <FaRegCommentDots className="text-4xl text-blue-500 mb-2" />
                  <span className="text-3xl font-bold text-blue-700">{stats.comments}</span>
                  <span className="text-blue-700 mt-2 font-medium">Total Comments</span>
                </div>
              </div>
              {/* Most Liked Blog Card */}
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-6 w-full max-w-xs hover:shadow-xl transition-shadow border border-primary-200">
                  <div className="flex items-center mb-2">
                    <FaStar className="text-yellow-400 text-2xl mr-2" />
                    <span className="text-primary-700 font-semibold text-lg">Most Liked Blog</span>
                  </div>
                  {stats.mostLikedBlog ? (
                    <div>
                      <img
                        src={stats.mostLikedBlog.image}
                        alt={stats.mostLikedBlog.title}
                        className="w-full h-32 object-cover rounded mb-2 border"
                      />
                      <h4 className="text-lg font-bold text-primary-800 mb-1">
                        {stats.mostLikedBlog.title}
                      </h4>
                      <p className="text-primary-600 text-sm line-clamp-2 mb-2">
                        {stats.mostLikedBlog.description}
                      </p>
                      <div className="flex items-center gap-2 text-primary-600 text-xs">
                        <FaRegHeart className="text-pink-500" />
                        {stats.mostLikedBlog.likes} Likes
                      </div>
                    </div>
                  ) : (
                    <span className="text-primary-400">No blogs yet.</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "followers" && (
            <div>
              <h3 className="text-lg font-bold mb-4">Followers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {followers.length === 0 && <p>No followers yet.</p>}
                {followers.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center bg-primary-50 p-3 rounded shadow"
                  >
                    <img
                      src={f.profile_image}
                      alt={f.name}
                      className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                    <span className="text-primary-800 font-semibold">
                      {f.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "followings" && (
            <div>
              <h3 className="text-lg font-bold mb-4">Followings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {followings.length === 0 && <p>Not following anyone yet.</p>}
                {followings.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center bg-primary-50 p-3 rounded shadow"
                  >
                    <img
                      src={f.profile_image}
                      alt={f.name}
                      className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                    <span className="text-primary-800 font-semibold">
                      {f.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

            {/* Change Password */}
          {activeTab === "change-password" && (
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-bold mb-4 text-center">Change Password</h3>
              <form
                onSubmit={handlePasswordSubmit}
                className="flex flex-col items-center gap-4"
              >
                <input
                  type="password"
                  name="old"
                  value={passwords.old}
                  onChange={handlePasswordChange}
                  className="p-2 placeholder:text-gray-400 text-primary-900 bg-black bg-opacity-20 border-[1px] border-primary-400 rounded w-full"
                  placeholder="Current Password"
                  required
                />
                <input
                  type="password"
                  name="new"
                  value={passwords.new}
                  onChange={handlePasswordChange}
                  className="p-2 placeholder:text-gray-400 text-primary-900 bg-black bg-opacity-20 border-[1px] border-primary-400 rounded w-full"
                  placeholder="New Password"
                  required
                />
                <input
                  type="password"
                  name="confirm"
                  value={passwords.confirm}
                  onChange={handlePasswordChange}
                  className="p-2 placeholder:text-gray-400 text-primary-900 bg-black bg-opacity-20 border-[1px] border-primary-400 rounded w-full"
                  placeholder="Confirm New Password"
                  required
                />
                <button
                  type="submit"
                  className="bg-primary-600 text-primary-100 w-[40%] px-4 py-2 rounded hover:bg-primary-700"
                >
                  Change Password
                </button>
                {passwordMsg && (
                  <p className="text-sm text-center text-red-500">
                    {passwordMsg}
                  </p>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
