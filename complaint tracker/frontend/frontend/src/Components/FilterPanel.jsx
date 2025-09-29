import { useState } from "react";

export default function FilterPanel({ onFilter }) {
  const [filters, setFilters] = useState({
    group_id: "",
    status: "",
    startDate: "",
    endDate: "",
    type: "",
    area: "",
    urgency: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-r from-purple-50 via-pink-50 to-yellow-50 p-6 rounded-xl shadow-lg flex flex-wrap gap-4 items-end transition-transform hover:scale-105"
    >
      {/* Group ID */}
      <input
        name="group_id"
        placeholder="Group ID"
        value={filters.group_id}
        onChange={handleChange}
        className="border border-purple-300 p-2 rounded-lg w-40 focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
      />

      {/* Status */}
      <select
        name="status"
        value={filters.status}
        onChange={handleChange}
        className="border border-green-300 p-2 rounded-lg w-40 focus:ring-2 focus:ring-green-400 focus:outline-none transition"
      >
        <option value="">Status</option>
        <option value="PENDING">PENDING</option>
        <option value="APPROVED">APPROVED</option>
        <option value="OPEN">OPEN</option>
        <option value="IN_PROGRESS">IN_PROGRESS</option>
        <option value="RESOLVED">RESOLVED</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>

      {/* Type */}
      <input
        name="type"
        placeholder="Type"
        value={filters.type}
        onChange={handleChange}
        className="border border-indigo-300 p-2 rounded-lg w-40 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
      />

      {/* Area */}
      <input
        name="area"
        placeholder="Area"
        value={filters.area}
        onChange={handleChange}
        className="border border-pink-300 p-2 rounded-lg w-40 focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
      />

      {/* Urgency */}
      <select
        name="urgency"
        value={filters.urgency}
        onChange={handleChange}
        className="border border-red-300 p-2 rounded-lg w-40 focus:ring-2 focus:ring-red-400 focus:outline-none transition"
      >
        <option value="">Urgency</option>
        <option value="LOW">LOW</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="HIGH">HIGH</option>
      </select>

      {/* Start Date */}
      <input
        name="startDate"
        type="date"
        value={filters.startDate}
        onChange={handleChange}
        className="border border-yellow-300 p-2 rounded-lg w-40 focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
      />

      {/* End Date */}
      <input
        name="endDate"
        type="date"
        value={filters.endDate}
        onChange={handleChange}
        className="border border-teal-300 p-2 rounded-lg w-40 focus:ring-2 focus:ring-teal-400 focus:outline-none transition"
      />

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:from-indigo-500 hover:to-blue-500 transition transform hover:scale-105"
      >
        Search
      </button>
    </form>
  );
}
