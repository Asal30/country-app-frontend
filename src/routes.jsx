import { Link } from "react-router-dom";

export default function LinkItem({ to, icon, label }) {
    return (
        <Link
            to={to}
            className="flex items-center gap-3 text-[#FFFFFF] text-xl font-medium px-4 py-2 rounded-lg hover:bg-[#6B82A0] transition-all justify-center"
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
}