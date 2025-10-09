import React, { useEffect, useState } from "react";
import { getCityLocalities } from "../api/heatmap.js";
import { useNavigate } from "react-router-dom";
import { getGroups } from "../api/groups.js";
import CreateGroupModal from "../Components/CreateGroupModal";
import "../css/GroupIndex.css";
export default function GroupIndex() {
  const [groups, setGroups] = useState([]);
  const [cityLocalities, setCityLocalities] = useState({});
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("");
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const userRole = localStorage.getItem("role");

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
    <div className="group-index-container">
      <div className="group-index-header">
        <h1>Available Groups</h1>
        {userRole === "moderator" && (
          <button
            onClick={() => setShowModal(true)}
            className="create-group-btn"
          >
            + Create Group
          </button>
        )}
        
      </div>
      {showModal && <CreateGroupModal onClose={() => setShowModal(false)} />}

      <div className="group-filters">
        <div>
          <label>City:</label>
          <select
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setSelectedLocality("");
            }}
          >
            <option value="">All Cities</option>
            {Object.keys(cityLocalities).map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Locality:</label>
          <select
            value={selectedLocality}
            onChange={(e) => setSelectedLocality(e.target.value)}
            disabled={!selectedCity}
          >
            <option value="">All Localities</option>
            {localities.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="groups-grid">
        {groups.map((g) => (
          <div
            key={g.group_id}
            className="group-card"
            onClick={() =>
              navigate("/group", {
                state: { group_id: g.group_id, creator: g.created_by, gname: g.name },
              })
            }
          >
            <h2>{g.name}</h2>
            <p>Created by: {g.created_by_name} • {new Date(g.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
