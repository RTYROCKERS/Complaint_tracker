import { useEffect } from "react";
import L from "leaflet";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";

export default function Heatmap({ posts }) {
  useEffect(() => {
    const map = L.map("map").setView([20, 78], 5); // Default center of India

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    if (posts.length) {
      // Use severity as intensity
      const heatData = posts.map(p => [
        p.latitude,
        p.longitude,
        p.severity || 0.5, // default 0.5 if severity is missing
      ]);
      L.heatLayer(heatData, { radius: 25 }).addTo(map);

      // Fit map bounds
      const bounds = posts.map(p => [p.latitude, p.longitude]);
      map.fitBounds(bounds, { padding: [50, 50] });

      // Add markers for hover popups (show type)
      posts.forEach(p => {
        if (p.latitude && p.longitude) {
          const marker = L.circleMarker([p.latitude, p.longitude], {
            radius: 5,
            fillColor: "#FF6F3C",
            color: "#FF6F3C",
            weight: 1,
            opacity: 0,
            fillOpacity: 0, // invisible, just for popup
          }).addTo(map);

          marker.bindPopup(`<b>Type:</b> ${p.type}<br><b>Severity:</b> ${p.severity}`);
        }
      });
    }

    return () => map.remove();
  }, [posts]);

  return <div id="map" style={{ height: "600px", width: "100%" }}></div>;
}
