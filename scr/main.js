import L from "leaflet";
import Supercluster from "supercluster";
import "leaflet.heat";

let map = L.map("map").setView([52.114, 8.673], 11);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

let markersLayer = L.layerGroup().addTo(map);
let heatLayer;

let activeTypes = new Set(["police","traffic","construction"]);

async function loadData(){
 const [police,traffic]=await Promise.all([
  fetch("/api/ots").then(r=>r.json()),
  fetch("/api/traffic").then(r=>r.json())
 ]);
 return [...police,...traffic];
}

function render(points){
 markersLayer.clearLayers();
 if(heatLayer) map.removeLayer(heatLayer);

 const filtered=points.filter(p=>activeTypes.has(p.type));

 heatLayer=L.heatLayer(filtered.map(p=>[p.lat,p.lng,0.6]),{radius:25}).addTo(map);

 const cluster=new Supercluster({radius:40,maxZoom:16});
 cluster.load(filtered.map(p=>({
  type:"Feature",
  geometry:{type:"Point",coordinates:[p.lng,p.lat]},
  properties:p
 })));

 const bounds=map.getBounds();
 const zoom=map.getZoom();

 const clusters=cluster.getClusters([
  bounds.getWest(),
  bounds.getSouth(),
  bounds.getEast(),
  bounds.getNorth()
 ],zoom);

 clusters.forEach(c=>{
  const [lng,lat]=c.geometry.coordinates;
  if(c.properties.cluster){
   L.circleMarker([lat,lng],{radius:20,color:"#007aff"}).addTo(markersLayer);
  } else {
   const emoji={police:"🚔",traffic:"🚗",construction:"🚧"}[c.properties.type];
   L.marker([lat,lng]).bindPopup(`${emoji} ${c.properties.title}`).addTo(markersLayer);
  }
 });
}

document.querySelectorAll(".controls button").forEach(btn=>{
 btn.onclick=()=>{
  const type=btn.dataset.type;
  activeTypes.has(type)?activeTypes.delete(type):activeTypes.add(type);
  init();
 };
});

async function init(){
 const data=await loadData();
 render(data);
}

setInterval(init,60000);
init();