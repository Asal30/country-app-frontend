import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage({ setToken, setRole, setUserId }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      axios
        .post(import.meta.env.VITE_BACKEND_URL + "/api/auth/login", {
          username: username,
          password: password,
        })
        .then((response) => {
          console.log(response.data.message);
          setToken(response.data.token);
          setRole(response.data.user_type || "user");
          setUserId(response.data.userId);
          navigate(
            response.data.user_type === "admin" ? "/admin" : "/dashboard"
          );
        });
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md backdrop-blur bg-white bg-opacity-10 rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center text-primary-800 mb-8">
          Welcome Back
        </h2>

        {/* Error Message */}
        {error && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
              <h2 className="text-lg font-semibold text-red-600 mb-2">Error</h2>
              <p className="text-gray-700 mb-4">{error}</p>
              <button
                onClick={() => setError('')}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                OK
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">
              Username
            </label>
            <input
              type="text"
              className="placeholder:text-primary-900-opacity-50 text-primary-900 bg-black bg-opacity-20 w-full p-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="your_username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="placeholder:text-primary-900-opacity-50 text-primary-900 bg-black bg-opacity-20 w-full p-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-primary-100 py-3 rounded-lg font-medium transition focus:ring-2 focus:ring-primary-500 focus:outline-none"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/register"
            className="text-primary-600 hover:text-primary-800 font-medium transition"
          >
            Don't have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
}
