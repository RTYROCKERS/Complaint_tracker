import { useEffect } from "react";
import L from "leaflet";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";

export default function HeatMap({ posts }) {
  useEffect(() => {
    const map = L.map("map").setView([12.9716, 77.5946], 12); // default coords (Bangalore example)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    if (posts.length) {
      const heatData = posts.map(p => [p.latitude, p.longitude, 0.5]); // last value = intensity
      L.heatLayer(heatData, { radius: 25 }).addTo(map);
    }

    return () => map.remove();
  }, [posts]);

  return <div id="map" style={{ height: "600px", width: "100%" }}></div>;
}
