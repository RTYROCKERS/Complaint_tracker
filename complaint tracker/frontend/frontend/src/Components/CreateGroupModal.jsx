import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import '../css/CreateGroupModal.css';

const API = `${process.env.REACT_APP_BACKEND}`;

export default function CreateGroupModal({ onClose }) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [coords, setCoords] = useState(null);
  const [validLocation, setValidLocation] = useState(false); // new
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([20.5937, 78.9629], 5); // Center of India

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);

      mapRef.current.on("click", async (e) => {
        const { lat, lng } = e.latlng;
        setCoords({ lat, lng });

        // Add marker
        if (markerRef.current) markerRef.current.remove();
        markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);

        // Reverse geocode
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );
          const data = await res.json();

          const cityName =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.county ||
            "";
          const localityName =
            data.address.suburb ||
            data.address.neighbourhood ||
            data.address.locality ||
            data.address.road ||
            "";

          setCity(cityName);
          setLocality(localityName);

          // Check if reverse geocoding returned valid city & locality
          if (cityName && localityName) setValidLocation(true);
          else setValidLocation(false);
        } catch (err) {
          console.error("Reverse geocoding failed:", err);
          setValidLocation(false);
        }
      });
    }

    setTimeout(() => {
      mapRef.current.invalidateSize();
    }, 100);

    return () => {
      if (mapRef.current) mapRef.current.remove();
      mapRef.current = null;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validLocation) return alert("Please select a valid location on the map with city and locality.");

    try {
      await axios.post(`${API}/newGroup`, {
        name,
        city,
        locality,
        user_id: userId,
      });
      alert("Group created successfully!");
      onClose();
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to create group.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[600px]">
        <h2 className="text-xl font-semibold mb-4">Create New Group</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="border w-full p-2 rounded"
            placeholder="Group Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div id="map" className="h-64 rounded mb-2 border"></div>

          <input
            className="border w-full p-2 rounded"
            placeholder="City"
            value={city}
            readOnly
          />
          <input
            className="border w-full p-2 rounded"
            placeholder="Locality"
            value={locality}
            readOnly
          />

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded text-white ${validLocation ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
              disabled={!validLocation}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
