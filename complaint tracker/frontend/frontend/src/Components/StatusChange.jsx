import React, { useState } from "react";

export default function StatusChange({ status, onStatusUpdate }) {
  const [localStatus, setLocalStatus] = useState(status);

  const handleChange = () => {
    onStatusUpdate(localStatus);
  };

  return (
    <div className="border p-4 rounded bg-gray-100 mt-4">
      <h3 className="font-bold mb-2">Change Post Status</h3>
      <select
        value={localStatus}
        onChange={(e) => setLocalStatus(e.target.value)}
        className="border p-2 rounded mr-3"
      >
        <option value="OPEN">OPEN</option>
        <option value="IN_PROGRESS">IN_PROGRESS</option>
        <option value="RESOLVED">RESOLVED</option>
      </select>
      <button
        onClick={handleChange}
        className="bg-blue-600 text-white px-3 py-2 rounded"
      >
        Update Status
      </button>
    </div>
  );
}
