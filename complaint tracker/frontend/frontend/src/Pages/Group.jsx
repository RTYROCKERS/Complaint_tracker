import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents, Circle, Tooltip } from "react-leaflet";
import L from "leaflet";
import { getGroupPosts, createComplaint } from "../api/groups.js";
import FilePreview from "../Components/FilePreview.jsx";
import socket from "../socket";
import "../css/Group.css";

const markerIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationPicker({ setFormData, groupCoords }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      if (!groupCoords) return;

      const { lat, lng } = e.latlng;

      // Haversine formula to calculate distance in km
      const R = 6371;
      const dLat = ((lat - groupCoords.lat) * Math.PI) / 180;
      const dLng = ((lng - groupCoords.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((groupCoords.lat * Math.PI) / 180) *
          Math.cos((lat * Math.PI) / 180) *
          Math.sin(dLng / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      if (distance > 20) {
        alert("You can only create posts within 100 km of the group location.");
        return;
      }

      setPosition({ lat, lng });
      setFormData((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
      }));
    },
  });

  return (
    <>
      {position && <Marker position={position} icon={markerIcon} />}
      {groupCoords && <Marker position={groupCoords} icon={markerIcon} />}
    </>
  );
}

export default function GroupPage() {
  const location = useLocation();
  const { group_id, creator, gname, gcity, glocality} = location.state || {};
  const [posts, setPosts] = useState([]);
  const [groupCoords, setGroupCoords] = useState(null);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState(null);
  const [summaries, setSummaries] = useState({});
  const [summaryVisible, setSummaryVisible] = useState({});
  const [orderType, setOrderType] = useState("recent");

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
    socket.on("postAdded", (newPost) => {
      setPosts((prev) => [newPost, ...prev]);
    });
    return () => socket.off("postAdded");
  }, [group_id]);

  useEffect(() => {
    if (!location.state) return;

    const fetchGroupCoords = async () => {
      const { gcity, glocality } = location.state;
      const coords = await getCoordsFromAddress(gcity, glocality);
      if (coords) setGroupCoords(coords);
    };

    fetchGroupCoords();
  }, [location.state]);

  useEffect(() => {
    if (!group_id) return;

    const fetchPosts = async () => {
      setLoadingPosts(true);
      try {
        if (orderType === "recent") {
          const data = await getGroupPosts(group_id);
          setPosts(data);
        } else if (orderType === "recommend") {
          const res = await fetch(`${process.env.REACT_APP_PBACKEND2}/recommend_group/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ group_id }),
          });
          const data = await res.json();
          console.log("Recommended posts:", data);
          setPosts(data.ranked_posts || []);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, [group_id, orderType]);

  const getCoordsFromAddress = async (city, locality) => {
    if (!city && !locality) return null;

    const q = `${locality || ""}, ${city || ""}`.trim();

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`
      );

      const data = await res.json();
      if (data?.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
    } catch (err) {
      console.error("Geocoding failed:", err);
    }
    return null;
  };



  const fetchSummary = async (post_id) => {
    if (summaries[post_id]) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_PBACKEND2}/summarize_post/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id }),
      });
      const data = await res.json();
      if (data.summary) setSummaries((prev) => ({ ...prev, [post_id]: data.summary }));
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };

  const handlePredict = async () => {
    if (!formData.photo) return alert("Please upload an image first!");
    const data = new FormData();
    data.append("file", formData.photo);
    try {
      const res = await fetch(`${process.env.REACT_APP_PBACKEND}/predict/`, { method: "POST", body: data });
      if (!res.ok) throw new Error("Prediction failed");
      const result = await res.json();
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
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.latitude || !formData.longitude) {
      return alert("Please select a valid location within 100 km of the group.");
    }
    const data = new FormData();
    data.append("user_id", 1);
    data.append("group_id", group_id);
    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });
    await createComplaint(data);
    setShowModal(false);
    setPreview(null);
};


  if (!group_id) return <p className="text-red-500">No group selected.</p>;

  return (
    <div className="container mx-auto p-4 relative">
      <h1 className="text-3xl font-bold mb-4 text-circus-gold">
        Posts in Group <span className="text-white">{gname}</span>
      </h1>

      <div className="mb-4 flex items-center gap-2">
        <label className="text-white font-medium">Order By:</label>
        <select value={orderType} onChange={(e) => setOrderType(e.target.value)} className="input-field">
          <option value="recent">Recent</option>
          <option value="recommend">Recommended</option>
        </select>
      </div>

      <button onClick={() => setShowModal(true)} className="btn-add-post">+ Add Post</button>

      {showModal && (
        <div className="add-post-card mt-4">
          <h2 className="text-2xl font-bold mb-4 text-circus-teal">Create Post</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="phold input-field mb-2" required />
            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="phold input-field mb-2" required />
            <select name="status" value={formData.status} onChange={handleChange} className="input-field mb-2">
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
            <input type="text" name="type" placeholder="Type" value={formData.type} onChange={handleChange} className="phold input-field mb-2" />
            <input type="number" name="days_required" placeholder="Days Required" value={formData.days_required} onChange={handleChange} className="phold input-field mb-2" />

            <div className="h-64 w-full border rounded-lg overflow-hidden">
              <MapContainer
                center={groupCoords ? [groupCoords.lat, groupCoords.lng] : [20.5937, 78.9629]}
                zoom={10}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {groupCoords && <LocationPicker setFormData={setFormData} groupCoords={groupCoords} />}
                {groupCoords && (
                  <Circle
                    center={groupCoords}
                    radius={20000} // 20 km
                    pathOptions={{ color: "blue", fillOpacity: 0.1 }}
                  />
                )}
                {groupCoords && (
                  <Marker position={groupCoords} icon={markerIcon}>
                    <Tooltip>Group Location</Tooltip>
                  </Marker>
                )}
              </MapContainer>
            </div>

            <input type="file" name="photo" onChange={handleChange} className="input-field mb-2" />
            {preview && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">File Preview:</p>
                <div className="file-preview mb-2"><FilePreview fileUrl={preview} /></div>
              </div>
            )}

            <button type="button" onClick={handlePredict} className="btn-predict mb-2">Predict</button>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="btn-predict mb-2">Cancel</button>
              <button type="submit" className="btn-submit">Submit</button>
            </div>
          </form>
        </div>
      )}

      {loadingPosts ? (
        <p className="text-gray-300 italic mt-4">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-300 italic mt-4">No posts available for this group.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {posts.map((p) => (
            <div key={p.post_id} className="bg-white/90 p-4 rounded-xl shadow-lg transition relative">
              <Link to={`/post/${p.post_id}`} state={{ post: p, creator, gname }} className="post-card-link">
                <div className={`status-ribbon ${p.status ? p.status.toLowerCase() : "open"}`}>
                  {p.status ? p.status.replace("_", " ") : "OPEN"}
                </div>
                <h2 className="text-xl font-semibold cursor-pointer hover:text-circus-teal">{p.title}</h2>
                <p className="text-gray-700 mt-2">{p.description}</p>
                {p.photourl && (
                  <div className="mt-3 w-full max-w-sm h-48 border rounded overflow-hidden bg-gray-100 mx-auto">
                    <FilePreview fileUrl={p.photourl} className="preview-image" />
                  </div>
                )}
                <div className="text-sm text-gray-500 mt-3">
                  Status: <span className="font-medium">{p.status || "OPEN"}</span> •
                  Type: {p.type || "N/A"} • Days: {p.days_required || "-"} •
                  {p.created_at ? new Date(p.created_at).toLocaleString() : "-"}
                </div>
              </Link>

              {/* Summary Button */}
              <div className="mt-2">
                <button
                  onClick={async () => {
                    await fetchSummary(p.post_id);
                    setSummaryVisible((prev) => ({ ...prev, [p.post_id]: true }));
                  }}
                  className="px-2 py-1 bg-circus-teal text-white rounded hover:bg-circus-gold text-sm"
                >
                  Summary
                </button>
              </div>

              {/* Summary Modal */}
              {summaryVisible[p.post_id] && (
                <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex flex-col items-center justify-center p-4 rounded-xl z-20">
                  <div className="bg-white p-4 rounded-lg max-w-sm w-full relative">
                    <p className="text-gray-800 text-sm">{summaries[p.post_id] || "Loading summary..."}</p>
                    <button
                      onClick={() =>
                        setSummaryVisible((prev) => ({ ...prev, [p.post_id]: false }))
                      }
                      className="absolute top-2 right-2 text-red-500 font-bold px-2 py-1 rounded hover:bg-red-100"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
