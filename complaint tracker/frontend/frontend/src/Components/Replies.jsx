import React, { useEffect, useState } from "react";
import { getPostReplies } from "../api/groups"; // your frontend API function
import socket from "../socket";
import "../css/CreateGroupModal.css";
import FilePreview from "../Components/FilePreview"; // adjust path if needed
const API = process.env.REACT_APP_BACKEND;

export default function Replies({ post_id }) {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReplies = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getPostReplies(post_id);
      setReplies(data);
    } catch (err) {
      setError("Failed to fetch replies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (post_id) fetchReplies();
  }, [post_id]);

  // Socket listener for real-time replies
  useEffect(() => {
    if (!post_id) return;

    socket.emit("joinPost", post_id);
    console.log("Joined post room:", post_id);

    const handleNewReply = (newReply) => {
      console.log("📝 New reply received via socket:", newReply);
      setReplies((prev) => [...prev, newReply]);
    };

    socket.on("replyAdded", handleNewReply);

    return () => {
      socket.off("replyAdded", handleNewReply);
    };
  }, [post_id]);

  if (loading) return <p className="text-gray-500 text-center">Loading replies...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (replies.length === 0) return <p className="text-gray-500 text-center">No replies yet.</p>;

  return (
    <div className="mt-4 space-y-4">
      
      {replies.map((r) => (
        <div key={r.reply_id} className="add-post-card">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-black">
              <span className="font-semibold">{r.name}</span>
            </p>
            <p className="text-xs text-gray-500">
              {new Date(r.created_at).toLocaleString()}
            </p>
          </div>
          <p className="text-black leading-relaxed">{r.content}</p>

          {/* Optional: File if reply has attachment */}
          {r.photourl && (
            <div className="file-preview mt-2">
              <FilePreview fileUrl={`${r.photourl}`} />
            </div>
            
          )}
        </div>
      ))}
    </div>
  );
}