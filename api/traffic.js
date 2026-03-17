export const config = {
  maxDuration: 10
};

export default async function handler(req, res) {
  try {
    const query = `
    [out:json];
    area[name="Kreis Herford"]->.a;
    (
      way["highway"="construction"](area.a);
    );
    out center;
    `;

    const data = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query
    }).then(r => r.json());

    const result = data.elements.map(el => ({
      type: "construction",
      title: "Baustelle",
      lat: el.center.lat,
      lng: el.center.lon
    }));

    res.setHeader("Cache-Control", "s-maxage=600");
    res.status(200).json(result);

  } catch {
    res.status(200).json([]);
  }
}
