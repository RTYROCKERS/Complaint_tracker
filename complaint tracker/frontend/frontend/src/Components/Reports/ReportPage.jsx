// frontend/src/components/Reports/ReportPage.jsx
import React, { useEffect, useState } from "react";
import { getCityLocalities } from "../../api/heatmap.js"; // <- your existing API
import ExportButtons from "./ExportButtons.jsx";

const ReportPage = () => {
  const [locationsMap, setLocationsMap] = useState({}); // { City: [locality1, locality2] }
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const map = await getCityLocalities();
        setLocationsMap(map || {});
        // set defaults to first available
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
    // When city changes, auto-select first locality of that city (if exists)
    if (selectedCity) {
      const locs = locationsMap[selectedCity] || [];
      setSelectedLocality((prev) => (locs.includes(prev) ? prev : locs[0] || ""));
    } else {
      setSelectedLocality("");
    }
  }, [selectedCity, locationsMap]);

  const cities = Object.keys(locationsMap);

  return (
    <div style={{ padding: 20 }}>
      <h2>Generate Reports (CSV / PDF)</h2>

      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <div>
          <label>City</label>
          <br />
          <select
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

        <div>
          <label>Locality</label>
          <br />
          <select
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

        <div style={{ alignSelf: "flex-end" }}>
          <small style={{ color: "#666" }}>
            (Leave empty city/locality to export ALL)
          </small>
        </div>
      </div>

      <ExportButtons city={selectedCity} locality={selectedLocality} />
    </div>
  );
};

export default ReportPage;