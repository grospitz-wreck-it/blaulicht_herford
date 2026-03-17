import * as L from "leaflet";
import "./styles.css";

console.log("läuft");

// Map
const map = L.map("map").setView([52.114, 8.673], 11);

// Tiles
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19
}).addTo(map);

// Marker
L.marker([52.114, 8.673])
  .addTo(map)
  .bindPopup("Herford")
  .openPopup();
