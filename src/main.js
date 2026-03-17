import * as L from "leaflet";

const map = L.map("map").setView([52.114, 8.673], 11);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap"
}).addTo(map);

L.marker([52.114, 8.673])
  .addTo(map)
  .bindPopup("Herford")
  .openPopup();
