import React, { useEffect, useState } from "react";
import { useLocation,Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { getGroupPosts, createComplaint } from "../api/groups.js";
import FilePreview from "../Components/FilePreview.jsx";
import socket from "../socket";
import "../css/Group.css";
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
      const res = await fetch(`${process.env.REACT_APP_PBACKEND}/predict/`, {
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
      
      <h1 className="text-3xl font-bold mb-6 text-circus-gold">
        Posts in Group <span className="text-white">{gname}</span>
      </h1>

      <button
        onClick={() => setShowModal(true)}
        className="btn-add-post">
        + Add Post
      </button>
      {/* Modal remains mostly same, just update buttons and spacing */}
      {showModal && (
        <div className="add-post-card mt-4">
          <h2 className="text-2xl font-bold mb-4 text-circus-teal">Create Post</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} className=" phold input-field mb-2" required />
            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="phold input-field mb-2" required />
            <select name="status" value={formData.status} onChange={handleChange} className="input-field mb-2">
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
            <input type="text" name="type" placeholder="Type" value={formData.type} onChange={handleChange} className="phold input-field mb-2" />
            <input type="number" name="days_required" placeholder="Days Required" value={formData.days_required} onChange={handleChange} className="phold input-field mb-2" />

            <div className="h-64 w-full border rounded-lg overflow-hidden">
              <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OSM</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationPicker setFormData={setFormData} />
              </MapContainer>
            </div>

            <input type="file" name="photo" onChange={handleChange} className="input-field mb-2" />
            {preview && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">File Preview:</p>
                <div className="file-preview mb-2">
                  <FilePreview fileUrl={preview} />
                </div>
              </div>
            )}

            <button type="button" onClick={handlePredict} className="btn-predict mb-2">
              Predict
            </button>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="btn-predict mb-2">Cancel</button>
              <button type="submit" className="btn-submit">Submit</button>
            </div>
          </form>
        </div>
      )}
      {posts.length === 0 ? (
        <p className="text-gray-300 italic">No posts available for this group.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((p) => (
            <div key={p.post_id} className="bg-white/90 p-4 rounded-xl shadow-lg hover:shadow-2xl transition relative">
              <Link to={`/post/${p.post_id}`} state={{ post: p, creator, gname }} className="post-card-link"> 
              <div className={`status-ribbon ${p.status.toLowerCase()}`}>
                {p.status.replace("_", " ")}
              </div>
              
                <h2 className="text-xl font-semibold cursor-pointer hover:text-circus-teal">{p.title}</h2>
              
              <p className="text-gray-700 mt-2">{p.description}</p>
              {p.photourl && (
                  <div className="mt-3 w-full max-w-sm h-48 border rounded overflow-hidden bg-gray-100 mx-auto">
                    <FilePreview fileUrl={p.photourl} className="preview-image" />
                  </div>
                )}

              <div className="text-sm text-gray-500 mt-3">
                Status: <span className="font-medium">{p.status}</span> • 
                Type: {p.type} • Days: {p.days_required} • 
                {new Date(p.created_at).toLocaleString()}
              </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      
  </div>
  );
}
