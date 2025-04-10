import { Link, useNavigate } from "react-router-dom";

function Header({token, logout, role}) {
  const navigate = useNavigate();
  const changeRoot = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-primary-800 text-white shadow-lg fixed top-0 left-0 right-0">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          CountryAPI Application
        </Link>

        <div className="flex space-x-4">
          {token ? (
            <>
            {role === "admin" && <Link to="/admin" className="px-3 py-2 rounded hover:bg-primary-700 transition">Admin</Link>}
            {role === "user" && <Link to="/dashboard" className="px-3 py-2 rounded hover:bg-primary-700 transition">Dashboard</Link>}
            <button onClick={changeRoot} className="px-3 py-2 rounded hover:bg-primary-700 transition">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2 rounded hover:bg-primary-700 transition">Login</Link>
              <Link to="/register" className="px-3 py-2 rounded hover:bg-primary-700 transition">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
