import Parser from "rss-parser";
const parser=new Parser();

export default async function handler(req,res){
 const feed=await parser.parseURL("https://www.presseportal.de/rss/dienststelle/polizeipraesidium-bielefeld");

 const items=await Promise.all(feed.items.slice(0,20).map(async item=>{
  const geo=await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(item.title)}&format=json&limit=1`).then(r=>r.json());
  if(!geo[0]) return null;
  return {
   type:"police",
   title:item.title,
   lat:parseFloat(geo[0].lat),
   lng:parseFloat(geo[0].lon)
  };
 }));

 res.setHeader("Cache-Control","s-maxage=600");
 res.json(items.filter(Boolean));
}