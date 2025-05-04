import { Link } from "react-router-dom";

export default function LinkItem({ to, label }) {
    return (
        <Link
            to={to}
            className="px-3 py-2 rounded hover:text-primary-600 transition duration-300 ease-in-out"
        >{label}
        </Link>
    );
}