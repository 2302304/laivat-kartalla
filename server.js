const express = require("express");
const app = express();

// Salli frontend-kutsut
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Kaupungin nimi koordinaateista
async function getCity(lat, lng) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
  );
  const data = await response.json();
  return data.address?.city || data.address?.town || "Tuntematon";
}

// Säätiedot koordinaateista
async function getWeather(lat, lng) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`
  );
  const data = await response.json();
  return {
    temperature: Math.round(data.current_weather.temperature),
    description: data.current_weather.weathercode < 3 ? "selkeää" : "pilvistä",
  };
}

// Kaikki laivat
app.get("/api/ships", async (req, res) => {
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  const url = `https://meri.digitraffic.fi/api/ais/v1/locations?from=${tenMinutesAgo}`;
  const response = await fetch(url);
  const data = await response.json();

  const ships = data.features
    .filter((f) => (f.properties.sog || 0) > 0.5)
    .map((f) => ({
      mmsi: f.properties.mmsi,
      geometry: f.geometry,
      properties: f.properties,
      speedKmh: (f.properties.sog || 0) * 1.852,
    }));

  res.json(ships);
});

// Yksi laiva
app.get("/api/ships/:mmsi", async (req, res) => {
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  const url = `https://meri.digitraffic.fi/api/ais/v1/locations?from=${tenMinutesAgo}`;
  const response = await fetch(url);
  const data = await response.json();

  const ship = data.features.find(
    (f) => f.properties.mmsi.toString() === req.params.mmsi
  );

  if (!ship) {
    return res.status(404).json({ error: "Laivaa ei löytynyt" });
  }

  const [lng, lat] = ship.geometry.coordinates;
  const city = await getCity(lat, lng);
  const weather = await getWeather(lat, lng);

  res.json({
    mmsi: ship.properties.mmsi,
    geometry: ship.geometry,
    properties: ship.properties,
    speedKmh: (ship.properties.sog || 0) * 1.852,
    city,
    weather,
  });
});

app.listen(3000, () => console.log("http://localhost:3000"));
