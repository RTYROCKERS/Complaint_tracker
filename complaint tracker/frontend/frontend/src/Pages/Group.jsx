import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { getGroupPosts, createComplaint } from "../api/groups.js";

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
  const { group_id } = location.state || {};
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "OPEN",
    type: "",
    severity: "",
    latitude: "",
    longitude: "",
    photo: null,
  });

  useEffect(() => {
    if (!group_id) return;
    const fetchPosts = async () => {
      const data = await getGroupPosts(group_id);
      setPosts(data);
    };
    fetchPosts();
  }, [group_id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
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

    const updated = await getGroupPosts(group_id);
    setPosts(updated);
  };

  if (!group_id) {
    return <p className="text-red-500">No group selected.</p>;
  }

  return (
    <div className="container mx-auto p-4 relative">
      <h1 className="text-2xl font-bold mb-4">Posts in Group #{group_id}</h1>

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
            <h2 className="text-lg font-semibold">{p.title}</h2>
            <p className="text-gray-700">{p.description}</p>
            {p.photourl && (
              <img
                src={`http://localhost:5000${p.photourl}`}
                alt="Post"
                className="mt-2 max-h-64 rounded"
              />
            )}
            
            <div className="text-sm text-gray-500 mt-2">
              Status: <span className="font-medium">{p.status}</span> • 
              Type: {p.type} • Severity: {p.severity} • 
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
                name="severity"
                placeholder="Severity"
                value={formData.severity}
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
