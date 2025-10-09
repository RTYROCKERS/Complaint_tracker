import React, { useEffect, useState } from "react";
import axios from "axios";
import FilePreview from "../Components/FilePreview"; // adjust path if needed
import "../css/CreateGroupModal.css";
const API = process.env.REACT_APP_BACKEND;

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
          className="add-post-card" // Reuse the Group modal card styling
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-black">
              Posted by{" "}
              <span className="font-semibold text-black">
                {u.official_name || "Official"}
              </span>
            </p>
            <p className="text-xs text-gray-500">
              {new Date(u.created_at).toLocaleString()}
            </p>
          </div>

          {/* Update Text */}
          {u.update_text && (
            <p className="text-black mb-3 leading-relaxed">{u.update_text}</p>
          )}

          {/* File (photo/video/pdf/etc) */}
          {u.photourl && (
            <div className="file-preview mt-3">
              <FilePreview fileUrl={`${API}${u.photourl}`} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}