import React, { useEffect, useState } from "react";
import Heatmap from "../Components/Heatmap.jsx";
import { getHeatmapPosts, getCityLocalities } from "../api/heatmap.js";

export default function HeatmapPage() {
  const [posts, setPosts] = useState([]);
  const [cityLocalities, setCityLocalities] = useState({});
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("");

  // Fetch city-locality options on mount
  useEffect(() => {
    const fetchCities = async () => {
      const data = await getCityLocalities();
      setCityLocalities(data);
    };
    fetchCities();
  }, []);

  // Fetch heatmap posts whenever city or locality changes
  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getHeatmapPosts(selectedCity, selectedLocality);
      setPosts(data);
    };
    fetchPosts();
  }, [selectedCity, selectedLocality]);

  // Helper: get localities for selected city
  const localities = selectedCity ? cityLocalities[selectedCity] || [] : [];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Complaints Heatmap</h1>

      {/* Dropdowns */}
      <div className="flex flex-wrap space-x-4 mb-4">
        {/* City Dropdown */}
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">City:</label>
          <select
            className="input-field phold"
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

        {/* Locality Dropdown */}
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Locality:</label>
          <select
            className="input-field phold"
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

      {/* Heatmap */}
      <div className="border rounded p-4 shadow">
        <Heatmap posts={posts} />
      </div>
    </div>
  );
}
