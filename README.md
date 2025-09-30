# Laivat kartalla -sovellus

Harjoitustehtävä, joka näyttää laivojen reaaliaikaisen sijainnin kartalla.  
Sovellus koostuu **Node.js/Express-backendista** ja **HTML/Leaflet-frontendista**.
---
## Toiminnot
- Näyttää kaikki liikkuvat laivat (Digitrafficin meriliikenne-API).
- Klikkaamalla laivaa näytetään tarkemmat tiedot:
  - MMSI-numero
  - Nopeus (km/h)
  - Sijainti (kaupunki + koordinaatit)
  - Sää (lämpötila ja kuvaus)
- "Näytä kaikki laivat" -painike palauttaa yleisnäkymän.
---
## Asennus ja käyttö

1. **Asenna riippuvuudet**  
   ```bash
   npm install
   
2. Käynnistä backend
   node server.js
  Backend toimii osoitteessa http://localhost:3000

4. Avaa frontend selaimessa (esim. Live Server -lisäosalla)
  index.html

Käytetyt teknologiat
Node.js
Express
Leaflet
 (karttakirjasto)
OpenStreetMap
Digitraffic Meriliikenne API

