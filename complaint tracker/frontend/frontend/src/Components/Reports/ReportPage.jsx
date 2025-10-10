import React, { useEffect, useState } from "react";
import { getCityLocalities } from "../../api/heatmap.js";
import ExportButtons from "./ExportButtons.jsx";
import "../../css/Group.css"; // <-- reuse your circus caravan theme file

const ReportPage = () => {
  const [locationsMap, setLocationsMap] = useState({});
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const map = await getCityLocalities();
        setLocationsMap(map || {});
        const cities = Object.keys(map || {});
        if (cities.length) {
          setSelectedCity(cities[0]);
          const firstLocalities = map[cities[0]] || [];
          if (firstLocalities.length) setSelectedLocality(firstLocalities[0]);
        }
      } catch (err) {
        console.error("Failed to load locations:", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      const locs = locationsMap[selectedCity] || [];
      setSelectedLocality((prev) => (locs.includes(prev) ? prev : locs[0] || ""));
    } else {
      setSelectedLocality("");
    }
  }, [selectedCity, locationsMap]);

  const cities = Object.keys(locationsMap);

  return (
    <div className="add-post-section" style={{ alignItems: "center", padding: "2rem 0" }}>
      <div className="add-post-card" style={{ width: "90%", maxWidth: "600px" }}>
        <h2
          style={{
            textAlign: "center",
            color: "#003049",
            fontFamily: "Fredoka One, Poppins, sans-serif",
            marginBottom: "1rem",
          }}
        >
          🎪 Generate Reports (CSV / PDF)
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* City Dropdown */}
          <div>
            <label
              style={{
                fontWeight: "600",
                color: "#000",
                display: "block",
                marginBottom: "0.25rem",
              }}
            >
              City
            </label>
            <select
              className="input-field"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">-- All Cities --</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Locality Dropdown */}
          <div>
            <label
              style={{
                fontWeight: "600",
                color: "#000",
                display: "block",
                marginBottom: "0.25rem",
              }}
            >
              Locality
            </label>
            <select
              className="input-field"
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              disabled={!selectedCity}
            >
              <option value="">-- All Localities --</option>
              {(locationsMap[selectedCity] || []).map((L) => (
                <option key={L} value={L}>
                  {L}
                </option>
              ))}
            </select>
          </div>

          <small style={{ color: "#4e4a40", textAlign: "center" }}>
            (Leave empty city/locality to export <b>ALL</b>)
          </small>

          {/* Export Buttons */}
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <ExportButtons city={selectedCity} locality={selectedLocality} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
