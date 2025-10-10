import { useEffect } from "react";
import L from "leaflet";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";
import "../css/Group.css";

// Custom pin icon
const createPinIcon = (color = "#069e6c") =>
  L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="36" viewBox="0 0 24 36">
        <path d="M12 0C5.372 0 0 5.372 0 12c0 9 12 24 12 24s12-15 12-24c0-6.628-5.372-12-12-12z" fill="${color}"/>
        <circle cx="12" cy="12" r="5" fill="#fff"/>
      </svg>
    `)}`,
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36],
  });

export default function Heatmap({ posts }) {
  useEffect(() => {
    const map = L.map("map").setView([20, 78], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    if (posts.length) {
      const heatData = posts.map((p) => [
        p.latitude,
        p.longitude,
        (p.days_required || 0.5) * 0.5,
      ]);
      L.heatLayer(heatData, { radius: 25 }).addTo(map);

      const markerLayer = L.layerGroup();
      posts.forEach((p) => {
        if (p.latitude && p.longitude) {
          const marker = L.marker([p.latitude, p.longitude], {
            icon: createPinIcon("#FF6F3C"), // custom orange pin
            title: `${p.type} (${p.days_required} days)`,
          });
          marker.bindPopup(
            `<b>Type:</b> ${p.type}<br><b>Days Required:</b> ${p.days_required}`
          );
          markerLayer.addLayer(marker);
        }
      });

      // Show/hide markers based on zoom
      if (map.getZoom() >= 8) map.removeLayer(markerLayer);
      else map.addLayer(markerLayer);

      map.on("zoomend", () => {
        const zoom = map.getZoom();
        if (zoom < 8) {
          if (!map.hasLayer(markerLayer)) map.addLayer(markerLayer);
        } else {
          if (map.hasLayer(markerLayer)) map.removeLayer(markerLayer);
        }
      });

      const bounds = posts.map((p) => [p.latitude, p.longitude]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => map.remove();
  }, [posts]);

  return (
    <div className="create-group-modal1 p-4 shadow-lg rounded-lg">
      <div
        id="map"
        className="modal-map"
        style={{
          width: "100%",
          height: "600px",
          borderRadius: "1rem",
          overflow: "hidden",
        }}
      ></div>
    </div>
  );
}