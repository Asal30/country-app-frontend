import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Header({ token, logout, role }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const changeRoot = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-primary-800 text-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          CountryAPI Application
        </Link>

        {/* Hamburger Menu for Mobile */}
        <button
          className="block md:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            ></path>
          </svg>
        </button>

        {/* Navigation Links */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } md:flex md:space-x-4 absolute md:static top-16 left-0 w-full md:w-auto bg-primary-800 md:bg-transparent md:items-center`}
        >
          <Link
            to="/"
            className="block px-3 py-2 rounded hover:bg-primary-700 transition md:inline"
          >
            Home
          </Link>
          <Link
            to="/search"
            className="block px-3 py-2 rounded hover:bg-primary-700 transition md:inline"
          >
            Search
          </Link>

          {token ? (
            <>
              {role === "admin" && (
                <Link
                  to="/admin"
                  className="block px-3 py-2 rounded hover:bg-primary-700 transition md:inline"
                >
                  Admin
                </Link>
              )}
              {(role === "user" || role === "admin") && (
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded hover:bg-primary-700 transition md:inline"
                >
                  Dashboard
                </Link>
              )}
              <Link
                to="/profile"
                className="block px-3 py-2 rounded hover:bg-primary-700 transition md:inline"
              >
                Profile
              </Link>
              <button
                onClick={changeRoot}
                className="block px-3 py-2 rounded hover:bg-primary-700 transition md:inline"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block px-3 py-2 rounded hover:bg-primary-700 transition md:inline"
            >
              Login/Register
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
