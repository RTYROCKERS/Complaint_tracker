import React, { useEffect, useState } from "react";
import { getPostReplies } from "../api/groups"; // your frontend API function
import socket from "../socket";

export default function Replies({ post_id }) {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReplies = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getPostReplies(post_id); // fetch replies for this post
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

    // Join post-specific room
    socket.emit("joinPost", post_id);
    console.log("Joined post room:", post_id);

    // Listen for new replies
    const handleNewReply = (newReply) => {
      console.log("📝 New reply received via socket:", newReply);
      setReplies((prev) => [...prev, newReply]); // append new reply
    };

    socket.on("replyAdded", handleNewReply);

    return () => {
      socket.off("replyAdded", handleNewReply);
    };
  }, [post_id]);

  if (loading) return <p className="text-gray-500">Loading replies...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (replies.length === 0) return <p className="text-gray-500">No replies yet.</p>;

  return (
    <div className="mt-4 space-y-4">
      {replies.map((r) => (
        <div key={r.reply_id} className="border rounded-lg p-3 bg-gray-50 shadow">
          <div className="text-sm text-gray-600">
            <span className="font-semibold">{r.name}</span> • {new Date(r.created_at).toLocaleString()}
          </div>
          <p className="mt-1 text-gray-800">{r.content}</p>
        </div>
      ))}
    </div>
  );
}
