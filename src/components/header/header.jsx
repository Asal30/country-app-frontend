import { Link, useNavigate } from "react-router-dom";
import  LinkItem from "../../routes";

function Header({ token, logout, role }) {
  const navigate = useNavigate();
  const changeRoot = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="backdrop-filter backdrop-blur-lg bg-opacity-30 bg-gray-900 text-white shadow-lg fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-primary-600 transition duration-300 ease-in-out">
          Travel Blogger
        </Link>

        <div className="flex space-x-4">
          {/* Common navigation links */}
          <LinkItem to="/" label="Home" />
          {token && (
            <>
              {role === "admin" && (
                <LinkItem to="/admin" label="Admin" />
              )}
            </>
          )}
          <LinkItem to="/userBlogs" label="My Blogs" />
          <LinkItem to="/comments" label="Comments" />
        </div>

        <div className="flex space-x justify-end">
          <LinkItem to="/profile" label="Profile" />
          {token ? (
            <button onClick={changeRoot} className="px-3 py-2 rounded hover:text-primary-600 transition duration-300 ease-in-out">
              Logout
            </button>
          ) : (
            <LinkItem to="/register" label="Login" />
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;


