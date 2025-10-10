import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { getHeatmapPosts } from "../../api/heatmap.js";
import { jsonToCsvString, makeFilename } from "./reportUtils.jsx";
import "../../css/Group.css";

const ExportButtons = ({ city = "", locality = "" }) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [loadingCsv, setLoadingCsv] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const normalizedCity = city?.trim().toLowerCase() || "";
  const normalizedLocality = locality?.trim().toLowerCase() || "";

  // useMemo ensures re-fetch triggers only when actual value changes
  const fetchParams = useMemo(() => {
    return { city: normalizedCity, locality: normalizedLocality };
  }, [normalizedCity, normalizedLocality]);

  useEffect(() => {
    (async () => {
      try {
        const params = {};
        if (city) params.city = city;
        if (locality) params.locality = locality;

        const res = await axios.get(`${process.env.REACT_APP_BACKEND}/getGroups`, { params });
        console.log("Groups fetched:", res.data);
        setGroups(res.data || []);
        if (res.data?.length) setSelectedGroup(res.data[0].group_id);
        else setSelectedGroup("");
      } catch (err) {
        console.error("Failed to fetch groups:", err);
        setGroups([]);
        setSelectedGroup("");
      }
    })();
  }, [city, locality]);


  const downloadCSV = async () => {
    try {
      setLoadingCsv(true);
      const data = await getHeatmapPosts(city, locality);
      if (!data?.length) {
        alert("No data found for the selected city/locality.");
        return;
      }

      const csvString = jsonToCsvString(data);
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = makeFilename("report", city, locality, "csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("CSV export error:", err);
      alert("Failed to generate CSV.");
    } finally {
      setLoadingCsv(false);
    }
  };

  const downloadPDF = async () => {
    if (!selectedGroup) {
      alert("Please select a group first.");
      return;
    }
    try {
      setLoadingPdf(true);
     const res = await axios.post(
      `${process.env.REACT_APP_PBACKEND2}/batch_summary/`,
      { group_id: selectedGroup }, // body data
      { responseType: "blob" }
      );
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `report_group_${selectedGroup}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF export error:", err);
      alert("Failed to generate PDF.");
    } finally {
      setLoadingPdf(false);
    }
  };

  return (
    <div className="export-container">
      <h2 className="export-title">Export Your Reports</h2>
      <p className="export-subtitle">Choose your preferred format below</p>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ fontWeight: 600 }}>Select Group (for PDF)</label>
        <select
          className="input-field"
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          <option value="">-- Choose a Group --</option>
          {groups.map((g) => {
            const localityStr = g.locality || "";
            const cityStr = g.city || "";
            const suffix =
              localityStr || cityStr
                ? ` (${localityStr}${localityStr && cityStr ? ", " : ""}${cityStr})`
                : "";
            return (
              <option key={g.group_id} value={g.group_id}>
                {g.name}
                {suffix}
              </option>
            );
          })}
        </select>
      </div>

      <div className="export-buttons">
        <button
          className="circus-button"
          onClick={downloadCSV}
          disabled={loadingCsv}
        >
          {loadingCsv ? "🎠 Preparing CSV..." : "🎟️ Download CSV"}
        </button>

        <button
          className="circus-button"
          onClick={downloadPDF}
          disabled={loadingPdf || !selectedGroup}
        >
          {loadingPdf ? "🎡 Preparing PDF..." : "🎪 Download PDF"}
        </button>
      </div>
    </div>
  );
};

export default ExportButtons;
