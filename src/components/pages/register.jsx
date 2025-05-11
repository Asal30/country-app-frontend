import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [userType, setUserType] = useState("user");
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();

  const handleAdminCheckboxChange = (e) => {
    setIsAdmin(e.target.checked);
    setUserType(e.target.checked ? "admin" : "user");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      axios.post(import.meta.env.VITE_BACKEND_URL + "/api/auth/register",
        {
          username: username,
          email: email,
          password: password,
          user_type: userType,
        }
      ).then((response) => {
        console.log(response.data.message);
      });

      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md backdrop-blur bg-white bg-opacity-10 rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center text-primary-800 mb-8">
          Create Account
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">Username</label>
            <input
              type="text"
              className="placeholder:text-primary-900-opacity-50 text-primary-900 bg-black bg-opacity-20 w-full p-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="your_username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">Email</label>
            <input
              type="email"
              className="placeholder:text-primary-900-opacity-50 text-primary-900 bg-black bg-opacity-20 w-full p-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">Password</label>
            <input
              type="password"
              className="placeholder:text-primary-900-opacity-50 text-primary-900 bg-black bg-opacity-20 w-full p-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">Confirm Password</label>
            <input
              type="password"
              className="placeholder:text-primary-900-opacity-50 text-primary-900 bg-black bg-opacity-20 w-full p-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Admin Selection Checkbox */}
          <div>
            <label className="inline-flex items-center text-sm font-medium text-primary-700">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={handleAdminCheckboxChange}
                className="form-checkbox h-5 w-5 text-primary-600 focus:ring-2 focus:ring-primary-500"
              />
              <span className="ml-2">Admin</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-medium transition focus:ring-2 focus:ring-primary-500 focus:outline-none"
          >
            Register
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-primary-600 hover:text-primary-800 font-medium transition"
          >
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}
