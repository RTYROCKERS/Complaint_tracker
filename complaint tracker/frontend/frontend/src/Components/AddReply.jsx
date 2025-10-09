import React, { useState } from "react";
import { addReply } from "../api/groups";
import "../css/CreateGroupModal.css";
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
    formData.append("user_id", localStorage.getItem("userId"));
    formData.append("content", content);
    if (photo) formData.append("photo", photo);

    try {
      setLoading(true);
      setError("");
      await addReply(formData);
      setContent("");
      setPhoto(null);
    } catch (err) {
      setError("Failed to submit reply.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-group-modal">
      <h2>Add Reply</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Write your reply..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
        />
        <div className="modal-buttons">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => {
              setContent("");
              setPhoto(null);
              setError("");
            }}
          >
            Cancel
          </button>
          <button type="submit" className="create-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit Reply"}
          </button>
        </div>
      </form>
    </div>
  );
}
