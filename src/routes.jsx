import { Link, useLocation } from "react-router-dom";

export default function LinkItem({ to, label }) {
    const location = useLocation();

    return (
        <Link
            to={to}
            className={`px-3 py-2 rounded hover:text-primary-600 transition duration-300 ease-in-out ${
                location.pathname === to ? "text-primary-600" : ""
            }`}
        >
            {label}
        </Link>
    );
}