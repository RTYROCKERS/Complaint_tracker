import React, { useEffect, useState } from "react";
import axios from "axios";
const API = "http://localhost:5000";

export default function AssignOfficial({ post_id }) {
  const [officials, setOfficials] = useState([]);

 useEffect(() => {
    axios
        .get(`${API}/officials`)
        .then((res) => setOfficials(res.data))
        .catch(console.error);
 }, []);

  const handleAssign = async (officialId) => {
    try {
        await axios.post(`${API}/posts/assignOfficial`, {
        post_id,
        officialId,
        });
        alert("Official assigned successfully!");
        window.location.reload();
    } catch (err) {
        console.error(err);
    }
  };

  return (
    <div className="border p-4 rounded bg-gray-100 mt-4">
      <h3 className="font-bold mb-2">Select an Official</h3>
      <ul>
        {officials.map((o) => (
          <li key={o.u_id} className="flex justify-between items-center mb-2">
            <span>{o.name}</span>
            <button
              onClick={() => handleAssign(o.u_id)}
              className="bg-green-500 text-white px-2 py-1 rounded"
            >
              Assign
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
