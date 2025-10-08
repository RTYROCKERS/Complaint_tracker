import React, { useEffect, useState } from "react";
import { useLocation,Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { getGroupPosts, createComplaint } from "../api/groups.js";
import FilePreview from "../Components/FilePreview.jsx";
import socket from "../socket";

const markerIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});


function LocationPicker({ setFormData }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setFormData((prev) => ({
        ...prev,
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      }));
    },
  });

  return position ? <Marker position={position} icon={markerIcon} /> : null;
}

export default function GroupPage() {
  const location = useLocation();
  const { group_id, creator, gname } = location.state || {};
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "OPEN",
    type: "",
    days_required: "",
    latitude: "",
    longitude: "",
    photo: null,
  });
  useEffect(() => {
    if (!group_id) return;
    socket.emit("joinGroup", group_id);
    console.log("Joined group:", group_id);

    // Listen for new posts in the same group
    socket.on("postAdded", (newPost) => {
      console.log("📩 New post received via socket:", newPost);
      setPosts((prev) => [newPost, ...prev]);
    });

    return () => {
      socket.off("postAdded");
    };
  }, [group_id]);
  useEffect(() => {
    if (!group_id) return;
    const fetchPosts = async () => {
      const data = await getGroupPosts(group_id);
      setPosts(data);
    };
    fetchPosts();
  }, [group_id]);
  const handlePredict = async () => {
    if (!formData.photo) {
      alert("Please upload an image first!");
      return;
    }

    const data = new FormData();
    data.append("file", formData.photo);

    try {
      const res = await fetch("http://127.0.0.1:8000/predict/", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        throw new Error("Prediction failed");
      }

      const result = await res.json();

      // Update type and days_required in formData
      setFormData((prev) => ({
        ...prev,
        type: result.predicted_issue,
        days_required: result.estimated_time_days,
      }));
    } catch (err) {
      console.error(err);
      alert("Prediction failed. Check console for details.");
    }
  };
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setFormData({ ...formData, [name]: file });

      // Generate preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("user_id", 1); // TODO: replace with logged-in user_id
    data.append("group_id", group_id);
    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });

    await createComplaint(data);
    setShowModal(false);
    setPreview(null);
    
  };

  if (!group_id) {
    return <p className="text-red-500">No group selected.</p>;
  }

  return (
    <div className="container mx-auto p-4 relative">
      <h1 className="text-2xl font-bold mb-4">Posts in Group {gname}</h1>

      <button
        onClick={() => setShowModal(true)}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Post
      </button>

      {posts.length === 0 ? (
        <p className="text-gray-500">No posts available for this group.</p>
      ) : (
        posts.map((p) => (
          
          <div key={p.post_id} className="border rounded-lg p-4 mb-3 bg-white shadow">
            <Link to={`/post/${p.post_id}`} state={{ post: p,creator:creator, gname: gname}}>
              <h2 className="text-lg font-semibold cursor-pointer hover:underline">{p.title}</h2>
            </Link>
            <p className="text-gray-700">{p.description}</p>
            {p.photourl && (
              <div className="mt-2 w-64 h-64 border rounded overflow-hidden">
                <img
                  src={`http://localhost:5000${p.photourl}`}
                  alt="Post"
                  className="w-full h-full object-contain"
                />
              </div>
            )}            
            <div className="text-sm text-gray-500 mt-2">
              Status: <span className="font-medium">{p.status}</span> • 
              Type: {p.type} • Days_Required: {p.days_required} • 
              {new Date(p.created_at).toLocaleString()}
            </div>
          </div>
        ))
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create Post</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>
              <input
                type="text"
                name="type"
                placeholder="Type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                name="days_required"
                placeholder="Days_Required"
                value={formData.days_required}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              {/* Map Picker */}
              <div className="h-64 w-full border rounded">
                <MapContainer
                  center={[20.5937, 78.9629]} // India center
                  zoom={5}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OSM</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationPicker setFormData={setFormData} />
                </MapContainer>
              </div>
              <p className="text-sm text-gray-500">
                Selected: {formData.latitude}, {formData.longitude}
              </p>

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
              <button
                type="button"
                onClick={handlePredict}
                className="mt-2 mb-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Predict
              </button>

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
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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
