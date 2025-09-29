import React, { useEffect, useState } from "react";
import { getCityLocalities } from "../api/heatmap.js";
import { useNavigate } from "react-router-dom";
import { getGroups } from "../api/groups.js";
export default function GroupIndex() {
  const [groups, setGroups] = useState([]);
  const [cityLocalities, setCityLocalities] = useState({});
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCities = async () => {
      const data = await getCityLocalities();
      setCityLocalities(data);
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      const data = await getGroups(selectedCity, selectedLocality);
      setGroups(data);
    };
    fetchGroups();
  }, [selectedCity, selectedLocality]);

  const localities = selectedCity ? cityLocalities[selectedCity] || [] : [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Groups</h1>

      {/* Filters */}
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

      {/* Groups List */}
      <div className="grid gap-4">
        {groups.map((g) => (
          <div
            key={g.group_id}
            className="p-4 border rounded-lg shadow cursor-pointer hover:bg-gray-100"
            onClick={() => navigate("/group", { state: { group_id: g.group_id } })}
          >
            <h2 className="text-lg font-semibold">{g.name}</h2>
            <p className="text-sm text-gray-500">
              Created by: {g.created_by_name} •{" "}
              {new Date(g.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
