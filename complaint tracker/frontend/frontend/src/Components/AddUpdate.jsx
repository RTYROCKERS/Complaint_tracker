import React, { useState } from "react";
import axios from "axios";
import FilePreview from "./FilePreview";
import "../css/CreateGroupModal.css";
const API = process.env.REACT_APP_BACKEND;

export default function AddUpdate({ post_id }) {
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    update_text: "",
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setFormData({ ...formData, [name]: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const official_id = localStorage.getItem("userId");
    const data = new FormData();
    data.append("official_id", official_id);
    data.append("post_id", post_id);
    data.append("update_text", formData.update_text);
    if (formData.photo) data.append("photo", formData.photo);

    try {
      await axios.post(`${API}/postResolvement`, data);
      alert("Update added successfully!");
      setShowModal(false);
      setPreview(null);
      setFormData({ update_text: "", photo: null });
    } catch (err) {
      console.error(err);
      alert("Failed to add update!");
    }
  };

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        className="bg-green-600 text-white px-3 py-2 rounded"
      >
        Add Update
      </button>

      {showModal && (
        <div className="create-group-modal-overlay">
          <div className="create-group-modal">
            <h2>Add Update</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                name="update_text"
                placeholder="Enter update details..."
                value={formData.update_text}
                onChange={handleChange}
                className="input-field"
                required
              />

              <input
                type="file"
                name="photo"
                onChange={handleChange}
                className="input-field"
              />

              {preview && (
                <div className="file-preview mt-2">
                  <p className="text-sm mb-1">File Preview:</p>
                  <FilePreview fileUrl={preview} />
                </div>
              )}

              <div className="modal-buttons">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="create-btn">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
