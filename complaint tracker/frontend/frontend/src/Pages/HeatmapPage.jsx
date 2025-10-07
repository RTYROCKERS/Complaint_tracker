// frontend/src/pages/HeatmapPage.jsx
import React, { useRef, useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
import "leaflet.markercluster";
/* Temporary Hard coded values
export default function HeatmapPage() {
  const [posts] = useState([
    { lat: 28.6139, lng: 77.209, days_required: 2, location: "Connaught Place, Delhi" },
    { lat: 28.7041, lng: 77.1025, days_required: 5, location: "Rohini, Delhi" },
    { lat: 28.5355, lng: 77.391, days_required: 8, location: "Noida Sector 62" },
    { lat: 28.4595, lng: 77.0266, days_required: 12, location: "Gurugram" },
    { lat: 28.4089, lng: 77.3178, days_required: 15, location: "Faridabad" },
  ]);

  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  const createHeatmapLayer = (map) => {
    if (!map) return;

    const maxDays = Math.max(...posts.map(p => p.days_required));
    const minDays = Math.min(...posts.map(p => p.days_required));
    const normalize = (d) => {
      if (maxDays === minDays) return 0.9;
      const t = (d - minDays) / (maxDays - minDays);
      return Math.max(0.6, 0.6 + t * 0.4);
    };

    const heatArray = posts.map(p => [p.lat, p.lng, normalize(p.days_required)]);
    const heatOptions = {
      radius: 35,
      blur: 25,
      maxZoom: 18,
      minOpacity: 0.15,
      gradient: { 0.2: "blue", 0.5: "lime", 0.7: "yellow", 0.9: "orange", 1.0: "red" },
    };

    // Heatmap first
    const heatLayer = L.heatLayer(heatArray, heatOptions).addTo(map);

    // Then markers above
    const markerLayer = L.featureGroup();

    posts.forEach(p => {
      const marker = L.circleMarker([p.lat, p.lng], {
        radius: 9, // bigger & visible
        fillColor: "#ff3333",
        color: "#b30000",
        weight: 1.5,
        opacity: 1,
        fillOpacity: 0.9,
      }).bindPopup(`<b>${p.location}</b><br/>Days required: ${p.days_required}`);

      markerLayer.addLayer(marker);
    });

    map.addLayer(markerLayer);
    markerLayer.bringToFront(); // ✅ Ensure markers above heatmap

    // Legend
    const legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend");
      div.style.padding = "6px 8px";
      div.style.background = "white";
      div.style.borderRadius = "6px";
      div.style.boxShadow = "0 1px 4px rgba(0,0,0,0.18)";
      div.innerHTML = "<b>Days Required</b><br/>";
      const grades = [minDays, Math.round((minDays + maxDays) / 2), maxDays];
      const colors = ["blue", "yellow", "red"];
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML += `
          <div style="display:flex;align-items:center;margin-top:6px">
            <i style="background:${colors[i]};width:18px;height:12px;display:inline-block;margin-right:8px"></i>
            <span>${grades[i]}</span>
          </div>`;
      }
      return div;
    };
    legend.addTo(map);

    map._ourLayers = { heatLayer, markerLayer, legend };
  };

  const onMapCreated = (map) => {
    mapRef.current = map;
    setMapReady(true);
  };

  useEffect(() => {
    if (!mapReady) return;
    const map = mapRef.current;
    createHeatmapLayer(map);

    return () => {
      if (map && map._ourLayers) {
        const { heatLayer, markerLayer, legend } = map._ourLayers;
        if (heatLayer) map.removeLayer(heatLayer);
        if (markerLayer) map.removeLayer(markerLayer);
        if (legend) legend.remove();
        delete map._ourLayers;
      }
    };
  }, [mapReady]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Complaints Heatmap (Test Data)</h1>
      <div className="h-[80vh] w-full border rounded-lg overflow-hidden">
        <MapContainer
          center={[28.6139, 77.209]}
          zoom={10}
          style={{ height: "100%", width: "100%" }}
          whenCreated={onMapCreated}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
        </MapContainer>
      </div>
    </div>
  );
}
*/

/* --------------------------------------------------------------------
   🔒 ORIGINAL CODE (Commented Out)
   Uncomment this later when backend integration is ready again
-----------------------------------------------------------------------*/
import Heatmap from "../Components/Heatmap.jsx";
import { getHeatmapPosts, getCityLocalities } from "../api/heatmap.js";

export default function HeatmapPage() {
  const [posts, setPosts] = useState([]);
  const [cityLocalities, setCityLocalities] = useState({});
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      const data = await getCityLocalities();
      setCityLocalities(data);
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const data = await getHeatmapPosts(selectedCity, selectedLocality);
      setPosts(Array.isArray(data) ? data : []);
      setLoading(false);
    };
    fetchPosts();
  }, [selectedCity, selectedLocality]);

  const localities = selectedCity ? cityLocalities[selectedCity] || [] : [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Complaints Heatmap</h1>
      <div className="flex space-x-4 mb-4">
        <div>
          <label className="block mb-1 font-semibold">City:</label>
          <select
            className="border border-gray-300 rounded p-2"
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setSelectedLocality("");
            }}
          >
            <option value="">All Cities</option>
            {Object.keys(cityLocalities).map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Locality:</label>
          <select
            className="border border-gray-300 rounded p-2"
            value={selectedLocality}
            onChange={(e) => setSelectedLocality(e.target.value)}
            disabled={!selectedCity}
          >
            <option value="">All Localities</option>
            {localities.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div className="mb-4">Loading posts...</div>}
      <Heatmap posts={posts} />
    </div>
  );
}/*
-----------------------------------------------------------------------*/

