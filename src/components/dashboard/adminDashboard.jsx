import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { FaUsers, FaKey, FaGlobe } from "react-icons/fa";
import axios from 'axios';

export default function AdminDashboard({ token }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    users: 0,
    apiKeys: 0,
    countries: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_BACKEND_URL + '/api/admin/dashboard-counts',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCounts(response.data);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        setCounts({
          users: 'Error',
          apiKeys: 'Error',
          countries: 'Error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const cards = [
    {
      title: "Users",
      count: loading ? '...' : counts.users,
      path: "/admin/users",
      icon: <FaUsers className="text-[#2C6975] text-4xl" />,
      description: "Manage user accounts and permissions",
    },
    {
      title: "API Keys",
      count: loading ? '...' : counts.apiKeys,
      path: "/admin/api-keys",
      icon: <FaKey className="text-[#2C6975] text-4xl" />,
      description: "Generate and manage API access keys",
    },
    {
      title: "Countries",
      count: loading ? '...' : counts.countries,
      path: "/admin/countries",
      icon: <FaGlobe className="text-[#2C6975] text-4xl" />,
      description: "View and manage geographical data",
    },
  ];

  return (
    <div className="min-h-screen p-16 flex flex-col align-center justify-between bg-[#E0ECDE]">
      {/* Header with Illustration */}
      <div className="flex flex-col md:flex-row justify-evenly items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#2C6975] mb-2">Admin Dashboard</h1>
          <p className="text-lg text-[#6B82A0]">Manage your application's core systems</p>
        </div>
        <img className="w-[400px] mt-10 mr-10" src="./src/assets/admin-illustration.svg" alt="Admin Illustration" />
      </div>

      {/* 3 Functional Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-14 mt-12">
        {cards.map((card) => (
            <div
            key={card.title}
            onClick={() => navigate(card.path)}
            className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 cursor-pointer transition-all border border-[#CDE0C9] hover:border-[#68B2A0]"
            >
            <div className="flex justify-between items-start mb-4">
                <div>
                <h2 className="text-xl font-bold text-[#2C6975] mb-2">{card.title}</h2>
                <p className="text-[#6B82A0]">{card.description}</p>
                </div>
                <div className="p-3 bg-[#E0ECDE] rounded-lg">
                {card.icon}
                </div>
            </div>
            <div className="flex items-end justify-between">
                <p className="text-3xl font-bold text-[#2C6975]">{card.count}</p>
                <button
                className="text-sm text-[#2C6975] hover:text-[#68B2A0] font-medium"
                onClick={(e) => {
                    e.stopPropagation(); // prevent triggering the parent card click
                    navigate(card.path);
                }}
                >
                Manage →
                </button>
            </div>
            </div>
        ))}
        </div>
          <div className="flex justify-center">
              <button
                  onClick={() => navigate('/dashboard')}
                  className="mt-12 bg-[#2C6975] text-white px-6 py-2 rounded-xl shadow hover:bg-[#68B2A0] transition-all"
              >
                  Go to User Dashboard
              </button>
          </div>

      {/* Simple Status Footer */}
      <div className="mt-12 text-center text-[#6B82A0] text-sm">
        System Status: <span className="text-green-600 font-medium">All systems operational</span>
      </div>
    </div>
  );
}