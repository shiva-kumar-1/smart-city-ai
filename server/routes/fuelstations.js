const express = require('express');
const router = express.Router();

const fuelStations = [
  { id: '1', name: 'HP City Center', address: '10 Fuel Lane, Central', brand: 'HP', type: 'petrol_diesel', mapsQuery: 'HP+petrol+pump+city+center' },
  { id: '2', name: 'IOC North Point', address: '22 Northern Rd', brand: 'Indian Oil', type: 'petrol_diesel', mapsQuery: 'Indian+Oil+North+Point' },
  { id: '3', name: 'BPCL East Zone', address: '55 East Blvd', brand: 'BPCL', type: 'petrol_diesel', mapsQuery: 'BPCL+East+Zone+fuel' },
  { id: '4', name: 'EV Charging Hub - South', address: '90 South Park', brand: 'TATA Power EV', type: 'ev_charging', mapsQuery: 'EV+charging+station+South+Park' },
  { id: '5', name: 'Essar South Mall', address: '12 Mall Road', brand: 'Essar', type: 'petrol_diesel', mapsQuery: 'Essar+petrol+Mall+Road' },
  { id: '6', name: 'Jio-bp West Hub', address: '88 West End', brand: 'Jio-bp', type: 'petrol_diesel_ev', mapsQuery: 'Jio+bp+West+End+fuel' },
];

router.get('/fuelstations', (req, res) => {
  res.json(fuelStations);
});

module.exports = router;
