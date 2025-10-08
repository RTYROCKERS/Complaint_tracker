import React, { useState } from "react";
import axios from "axios";
import FilePreview from "./FilePreview";

const API = "http://localhost:5000";

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
      //window.location.reload();
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add Update</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                name="update_text"
                placeholder="Enter update details..."
                value={formData.update_text}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />

              <input
                type="file"
                name="photo"
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              {preview && (
                <div className="mt-2 mb-2">
                    <p className="text-sm text-gray-500 mb-1">File Preview:</p>
                    <div className="border rounded overflow-hidden bg-gray-100">
                    <FilePreview fileUrl={preview} />
                    </div>
                </div>
               )}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
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
