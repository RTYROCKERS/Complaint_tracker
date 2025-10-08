import React, { useEffect, useState } from "react";
import axios from "axios";
import FilePreview from "../Components/FilePreview"; // adjust path if needed

const API = "http://localhost:5000";

export default function Updates({ post_id }) {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const res = await axios.post(`${API}/getUpdates`, { post_id });
        setUpdates(res.data.updates || []);
      } catch (err) {
        console.error("Failed to fetch updates:", err);
      } finally {
        setLoading(false);
      }
    };

    if (post_id) fetchUpdates();
  }, [post_id]);

  if (loading)
    return <p className="text-gray-500 text-center">Loading updates...</p>;

  if (!updates.length)
    return <p className="text-gray-500 text-center">No updates yet.</p>;

  return (
    <div className="space-y-4">
      {updates.map((u) => (
        <div
          key={u.resolvement_id}
          className="p-4 bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            
              <p className="text-sm text-gray-600">
                Posted by{" "}
                <span className="font-semibold text-blue-700">
                  {u.official_name || "Official"}
                </span>
              </p>
              <p className="text-xs text-gray-500">
                {new Date(u.created_at).toLocaleString()}
              </p>
        


          {/* Update Text */}
          {u.update_text && (
            <p className="text-gray-800 mb-3 leading-relaxed">
              {u.update_text}
            </p>
          )}

          {/* File (photo/video/pdf/whatever) */}
          {u.photourl && (
            <div className="mt-3">
              <FilePreview fileUrl={`${API}${u.photourl}`} />
            </div>
          )}
        </div>
        </div>
      ))}
    </div>
  );
}
