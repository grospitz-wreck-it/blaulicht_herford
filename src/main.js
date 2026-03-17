import * as L from "leaflet";
import "./styles.css";

// Karte initialisieren
const map = L.map("map").setView([52.114, 8.673], 11);

// ✅ Stabiler Tile Layer (funktioniert IMMER)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
  maxZoom: 19
}).addTo(map);

// Kreis Herford GeoJSON laden
fetch("/public/data/kreis_herford.geojson")
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      style: {
        color: "#007bff",
        weight: 2,
        fillOpacity: 0.1
      }
    }).addTo(map);
  });

// Beispiel Marker (Emoji)
const policeIcon = L.divIcon({
  html: "🚓",
  className: "",
  iconSize: [30, 30]
});

L.marker([52.114, 8.673], { icon: policeIcon })
  .addTo(map)
  .bindPopup("Polizeimeldung Herford");
