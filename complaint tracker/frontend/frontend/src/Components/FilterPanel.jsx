import { useState } from "react";

export default function FilterPanel({ onFilter }) {
  const [filters, setFilters] = useState({
    type: "",
    area: "",
    urgency: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters); // send filters to parent
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow-md flex flex-wrap gap-4 items-end"
    >
      <input
        name="type"
        placeholder="Type"
        value={filters.type}
        onChange={handleChange}
        className="border p-2 rounded w-40"
      />
      <input
        name="area"
        placeholder="Area"
        value={filters.area}
        onChange={handleChange}
        className="border p-2 rounded w-40"
      />
      <select
        name="urgency"
        value={filters.urgency}
        onChange={handleChange}
        className="border p-2 rounded w-40"
      >
        <option value="">Urgency</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <input
        name="startDate"
        type="date"
        value={filters.startDate}
        onChange={handleChange}
        className="border p-2 rounded w-40"
      />
      <input
        name="endDate"
        type="date"
        value={filters.endDate}
        onChange={handleChange}
        className="border p-2 rounded w-40"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Search
      </button>
    </form>
  );
}
