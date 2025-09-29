import { useState, useEffect } from "react";
import axios from "axios";
import FilterPanel from "../Components/FilterPanel.jsx";
import ComplaintCard from "../Components/Complaintcard.jsx";

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchComplaints = async (filters = {}) => {
    setLoading(true);
    const params = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key]) params[key] = filters[key];
    });

    try {
      const { data } = await axios.get("http://localhost:5000/complaints", { params });
      setComplaints(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComplaints(); // initial fetch
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Complaints</h1>
      <FilterPanel onFilter={fetchComplaints} />

      {loading ? (
        <p className="mt-4 text-gray-600">Loading...</p>
      ) : complaints.length === 0 ? (
        <p className="mt-4 text-gray-600">No complaints found.</p>
      ) : (
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          {complaints.map((c) => (
            <ComplaintCard key={c.c_id} complaint={c} />
          ))}
        </div>
      )}
    </div>
  );
}
