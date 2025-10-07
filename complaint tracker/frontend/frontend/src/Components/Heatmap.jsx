// frontend/src/Components/Heatmap.jsx
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";

// markercluster plugin + CSS (installed via npm)
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

// small local CSS classes (optional) can be added in your global css for better cluster look:
// .marker-cluster-small { background-color: rgba(102, 204, 255, 0.7); }
// .info.legend { background: white; padding: 6px 8px; border-radius: 4px; font-size:13px; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }

export default function Heatmap({ posts }) {
  const mapRef = useRef(null);
  const heatRef = useRef(null);
  const clusterRef = useRef(null);
  const legendRef = useRef(null);
  const tileLayerRef = useRef(null);

  // Prepare heat data and also compute min/max days_required (raw)
  const prepareHeatData = () => {
    if (!posts || posts.length === 0) return { heat: [], meta: { minRaw: null, maxRaw: null } };

    const valid = posts
      .map(p => {
        const lat = Number(p.latitude);
        const lng = Number(p.longitude);
        const raw = p.days_required != null ? Number(p.days_required) : null;
        return (Number.isFinite(lat) && Number.isFinite(lng)) ? { lat, lng, raw, type: p.type, post_id: p.post_id } : null;
      })
      .filter(Boolean);

    if (!valid.length) return { heat: [], meta: { minRaw: null, maxRaw: null } };

    const raws = valid.map(v => (v.raw == null ? null : v.raw)).filter(v => v != null);
    const minRaw = raws.length ? Math.min(...raws) : null;
    const maxRaw = raws.length ? Math.max(...raws) : null;

    // Make heat denser: map raw -> [0.6, 1.0] (higher baseline intensity)
    const normalize = (r) => {
      if (r == null || minRaw == null || maxRaw == null) return 0.7;
      if (minRaw === maxRaw) return 0.95;
      const t = (r - minRaw) / (maxRaw - minRaw);
      return Math.max(0.6, Math.min(1.0, 0.6 + t * 0.4));
    };

    const heat = valid.map(v => [v.lat, v.lng, normalize(v.raw), v]);
    return { heat, meta: { minRaw, maxRaw } };
  };

  // radius scaling: larger radius at low zooms to keep blobs visible
  const computeRadiusForZoom = (zoom) => {
    const baseZoom = 12;
    const baseRadius = 35; // increased base for denser look
    const z = Math.max(1, Math.min(20, zoom));
    // stronger scale so radius increases quickly when zoomed out
    const scale = Math.pow(1.8, (baseZoom - z));
    return Math.max(10, Math.round(baseRadius * scale));
  };

  useEffect(() => {
    // create map once
    if (mapRef.current) return;
    mapRef.current = L.map("map", { preferCanvas: true }).setView([20, 78], 5);

    tileLayerRef.current = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapRef.current);

    // create marker cluster group
    clusterRef.current = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 80,
      // default icon creation keeps the count. You can customize if you want.
      iconCreateFunction: function (cluster) {
        const count = cluster.getChildCount();
        // default class names from plugin will be applied; don't hard-code styles here
        return L.divIcon({
          html: `<div><span>${count}</span></div>`,
          className: "marker-cluster",
          iconSize: L.point(40, 40, true),
        });
      },
    }).addTo(mapRef.current);

    // legend control - initially empty, will be updated when posts arrive
    legendRef.current = L.control({ position: "bottomright" });
    legendRef.current.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend");
      div.innerHTML = "<b>Intensity → Days required</b><br><div style='height:8px;margin:6px 0;background:linear-gradient(90deg,#2b83ba,#fee08b,#f46d43);'></div><div style='display:flex;justify-content:space-between'><span id='minRaw'>—</span><span id='midRaw'>—</span><span id='maxRaw'>—</span></div>";
      return div;
    };
    legendRef.current.addTo(mapRef.current);

    // rebuild heat when zoom changes (so radius keeps appropriate scale)
    mapRef.current.on("zoomend", () => {
      if (!mapRef.current) return;
      // remove existing heat layer and re-add with new radius
      if (heatRef.current) {
        mapRef.current.removeLayer(heatRef.current);
        heatRef.current = null;
      }
      const { heat } = prepareHeatData();
      if (heat.length) {
        const zoom = mapRef.current.getZoom();
        const radius = computeRadiusForZoom(zoom);
        const heatPoints = heat.map(h => [h[0], h[1], h[2]]);
        heatRef.current = L.heatLayer(heatPoints, {
          radius,
          blur: Math.round(radius / 2),
          maxZoom: 18,
          minOpacity: 0.18,
          // gradient makes the heat look more pronounced — adjust if you want different colors
          gradient: { 0.2: "blue", 0.5: "yellow", 0.8: "orange", 1.0: "red" },
        }).addTo(mapRef.current);
      }
    });
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // clear previous heat & clusters
    if (heatRef.current) {
      mapRef.current.removeLayer(heatRef.current);
      heatRef.current = null;
    }
    if (clusterRef.current) {
      clusterRef.current.clearLayers();
    }

    const { heat, meta } = prepareHeatData();

    // update legend values
    try {
      const minEl = document.querySelector(".info.legend #minRaw");
      const midEl = document.querySelector(".info.legend #midRaw");
      const maxEl = document.querySelector(".info.legend #maxRaw");
      if (minEl && maxEl && midEl) {
        if (meta.minRaw == null) {
          minEl.innerText = "—";
          midEl.innerText = "—";
          maxEl.innerText = "—";
        } else {
          minEl.innerText = String(meta.minRaw);
          maxEl.innerText = String(meta.maxRaw);
          const mid = Math.round(((meta.minRaw + meta.maxRaw) / 2) * 10) / 10;
          midEl.innerText = String(mid);
        }
      }
    } catch (e) {
      // non-critical
    }

    if (!heat.length) {
      // no points: reset to India view
      mapRef.current.setView([20, 78], 5);
      return;
    }

    // add heat layer
    const zoom = mapRef.current.getZoom() || 5;
    const radius = computeRadiusForZoom(zoom);
    const heatPoints = heat.map(h => [h[0], h[1], h[2]]);
    heatRef.current = L.heatLayer(heatPoints, {
      radius,
      blur: Math.round(radius / 2),
      maxZoom: 18,
      minOpacity: 0.18,
      gradient: { 0.2: "blue", 0.5: "yellow", 0.8: "orange", 1.0: "red" },
    }).addTo(mapRef.current);

    // add markers to marker cluster group — keep markers invisible but cluster shows counts
    heat.forEach(item => {
      const lat = item[0], lng = item[1];
      const meta = item[3];
      const marker = L.circleMarker([lat, lng], {
        radius: 6,
        fillColor: "#FF6F3C",
        color: "#FF6F3C",
        weight: 1,
        opacity: 0.0,
        fillOpacity: 0.0,
      });

      const popupHtml = `<div style="font-size:13px">
        <b>Type:</b> ${meta.type || "N/A"}<br/>
        <b>Days required:</b> ${meta.raw != null ? meta.raw : "N/A"}
      </div>`;
      marker.bindPopup(popupHtml);
      clusterRef.current.addLayer(marker);
    });

    // fit bounds based on clusters' bounds (safer)
    const clusterBounds = clusterRef.current.getBounds();
    if (clusterBounds.isValid() && !clusterBounds.isEmpty()) {
      if (clusterRef.current.getLayers().length === 1) {
        // single point: zoom in for detail
        const center = clusterBounds.getCenter();
        mapRef.current.setView(center, 13);
      } else {
        mapRef.current.fitBounds(clusterBounds.pad(0.15), { padding: [50, 50] });
      }
    }

  }, [posts]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return <div id="map" style={{ height: "600px", width: "100%" }} />;
}
