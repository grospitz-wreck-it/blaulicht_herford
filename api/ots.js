import Parser from "rss-parser";

export const config = {
  maxDuration: 10
};

const parser = new Parser();

export default async function handler(req, res) {
  try {
    const feed = await parser.parseURL(
      "https://www.presseportal.de/rss/dienststelle/polizeipraesidium-bielefeld"
    );

    const items = await Promise.all(
      feed.items.slice(0, 10).map(async item => {
        try {
          const geo = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(item.title)}&format=json&limit=1`
          ).then(r => r.json());

          if (!geo[0]) return null;

          return {
            type: "police",
            title: item.title,
            lat: parseFloat(geo[0].lat),
            lng: parseFloat(geo[0].lon)
          };
        } catch {
          return null;
        }
      })
    );

    res.setHeader("Cache-Control", "s-maxage=600");
    res.status(200).json(items.filter(Boolean));

  } catch (err) {
    res.status(200).json([]);
  }
}
