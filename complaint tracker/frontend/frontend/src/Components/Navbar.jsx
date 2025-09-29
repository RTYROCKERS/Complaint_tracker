import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Filter state
  const [filters, setFilters] = useState({
    status: "",
    urgency: "",
    type: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    // Pass filters via query params
    const query = new URLSearchParams(newFilters).toString();
    if (location.pathname === "/posts") {
      navigate(`/posts?${query}`);
    } else if (location.pathname === "/heatmap") {
      navigate(`/heatmap?${query}`);
    }
  };

  const linkClass = (path) =>
    location.pathname === path
      ? "text-white bg-blue-600 px-3 py-2 rounded-md"
      : "text-gray-700 hover:bg-blue-100 px-3 py-2 rounded-md";

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-600">Complaint Tracker</div>

        <div className="flex items-center space-x-4">
          <Link to="/posts" className={linkClass("/posts")}>
            Posts
          </Link>
          <Link to="/heatmap" className={linkClass("/heatmap")}>
            Heatmap
          </Link>

          {/* Filters */}
          <div className="flex items-center space-x-2">
            {/* Status */}
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-md px-2 py-1"
            >
              <option value="">Status</option>
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>

            {/* Urgency */}
            <select
              name="urgency"
              value={filters.urgency}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-md px-2 py-1"
            >
              <option value="">Urgency</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>

            {/* Type */}
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-md px-2 py-1"
            >
              <option value="">Type</option>
              <option value="General">General</option>
              <option value="Complaint">Complaint</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
}
