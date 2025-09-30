import React, { useState } from "react";

import { addReply } from "../api/groups"; // your frontend API function

export default function AddReply({ post }) {
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Reply cannot be empty.");
      return;
    }

    const formData = new FormData();
    formData.append("post_id", post.post_id);
    formData.append("user_id", post.user_id);
    formData.append("content", content);
    if (photo) formData.append("photo", photo);
    console.log(post);
    try {
      setLoading(true);
      setError("");
      await addReply(formData); // call your API
      setContent("");
      setPhoto(null);
    } catch (err) {
      setError("Failed to submit reply.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow mt-4">
      <h3 className="text-lg font-semibold mb-2">Add Reply</h3>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          placeholder="Write your reply..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border p-2 rounded"
          rows={4}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          className="w-full"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Submitting..." : "Submit Reply"}
        </button>
      </form>
    </div>
  );
}
