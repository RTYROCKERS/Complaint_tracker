import React, { useState } from "react";
import { getHeatmapPosts } from "../../api/heatmap.js";
import { jsonToCsvString, makeFilename } from "./reportUtils.jsx";
import jsPDF from "jspdf";
import "../../css/Group.css";

const ExportButtons = ({ city = "", locality = "" }) => {
  const [loadingCsv, setLoadingCsv] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const downloadCSV = async () => {
    try {
      setLoadingCsv(true);
      const data = await getHeatmapPosts(city, locality);
      if (!data || data.length === 0) {
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
      alert("Failed to generate CSV. Check console for details.");
    } finally {
      setLoadingCsv(false);
    }
  };

  const downloadPDF = async () => {
    try {
      setLoadingPdf(true);
      const data = await getHeatmapPosts(city, locality);
      if (!data || data.length === 0) {
        alert("No data found for the selected city/locality.");
        return;
      }

      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const margin = 40;
      const maxWidth = 520;
      let y = 40;
      doc.setFontSize(14);
      doc.text(`Report for ${city || "All Cities"} - ${locality || "All"}`, margin, y);
      y += 18;
      doc.setFontSize(10);

      const keys = Object.keys(data[0] || {});
      let rowIndex = 0;

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const rowText = keys
          .map((k) => `${k}: ${row[k] === undefined ? "" : String(row[k])}`)
          .join(" | ");
        const split = doc.splitTextToSize(rowText, maxWidth);
        for (const line of split) {
          if (y > 780) {
            doc.addPage();
            y = 40;
          }
          doc.text(line, margin, y);
          y += 12;
        }
        y += 6;
        if (++rowIndex > 2000) {
          doc.text("-- truncated (too many rows). Prefer CSV for large exports --", margin, y);
          break;
        }
      }

      doc.save(makeFilename("report", city, locality, "pdf"));
    } catch (err) {
      console.error("PDF export error:", err);
      alert("Failed to generate PDF. Check console for details.");
    } finally {
      setLoadingPdf(false);
    }
  };

  return (
    <div className="export-container">
      <h2 className="export-title"> Export Your Reports </h2>
      <p className="export-subtitle">Choose your preferred format below</p>

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
          disabled={loadingPdf}
        >
          {loadingPdf ? "🎡 Preparing PDF..." : "🎪 Download PDF"}
        </button>
      </div>
    </div>
  );
};

export default ExportButtons;
