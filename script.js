// script.js
// This file provides the client‑side functionality for the Black Forge
// Logistics demo site. It handles quote calculations, simple form
// submissions and basic validation. No sensitive data is stored.

// Dataset: coordinates for major US cities (approximate)
const CITY_COORDINATES = {
  'New York, NY': { lat: 40.7128, lon: -74.006 },
  'Los Angeles, CA': { lat: 34.0522, lon: -118.2437 },
  'Chicago, IL': { lat: 41.8781, lon: -87.6298 },
  'Houston, TX': { lat: 29.7604, lon: -95.3698 },
  'Phoenix, AZ': { lat: 33.4484, lon: -112.074 },
  'Philadelphia, PA': { lat: 39.9526, lon: -75.1652 },
  'San Antonio, TX': { lat: 29.4241, lon: -98.4936 },
  'San Diego, CA': { lat: 32.7157, lon: -117.1611 },
  'Dallas, TX': { lat: 32.7767, lon: -96.797 },
  'San Jose, CA': { lat: 37.3382, lon: -121.8863 },
  'Austin, TX': { lat: 30.2672, lon: -97.7431 },
  'Jacksonville, FL': { lat: 30.3322, lon: -81.6557 },
  'Fort Worth, TX': { lat: 32.7555, lon: -97.3308 },
  'Columbus, OH': { lat: 39.9612, lon: -82.9988 },
  'Charlotte, NC': { lat: 35.2271, lon: -80.8431 },
  'San Francisco, CA': { lat: 37.7749, lon: -122.4194 },
  'Seattle, WA': { lat: 47.6062, lon: -122.3321 },
  'Denver, CO': { lat: 39.7392, lon: -104.9903 },
  'Miami, FL': { lat: 25.7617, lon: -80.1918 },
  'Atlanta, GA': { lat: 33.749, lon: -84.388 },
};

// Populate city select elements when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Quote form selects
  const originSelect = document.getElementById('origin');
  const destinationSelect = document.getElementById('destination');
  if (originSelect && destinationSelect) {
    Object.keys(CITY_COORDINATES).forEach((city) => {
      const option1 = document.createElement('option');
      option1.value = city;
      option1.textContent = city;
      originSelect.appendChild(option1);
      const option2 = document.createElement('option');
      option2.value = city;
      option2.textContent = city;
      destinationSelect.appendChild(option2);
    });
  }

  // Attach event listeners for forms if they exist
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleQuote();
    });
  }
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleContact();
    });
  }
  const carrierForm = document.getElementById('carrierForm');
  if (carrierForm) {
    carrierForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleCarrierSignup();
    });
  }
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleLogin();
    });
  }
});

// Haversine distance calculation (miles)
function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (val) => (val * Math.PI) / 180;
  const R = 3958.8; // Earth radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Quote calculator logic
function handleQuote() {
  const origin = document.getElementById('origin').value;
  const destination = document.getElementById('destination').value;
  const weight = parseFloat(document.getElementById('weight').value);
  const mode = document.getElementById('mode').value;
  const resultContainer = document.getElementById('quoteResult');
  const costEl = document.getElementById('quoteCost');
  const distEl = document.getElementById('quoteDistance');
  const emissionsEl = document.getElementById('quoteEmissions');
  // Basic validation
  if (origin === destination) {
    alert('Origin and destination must be different.');
    return;
  }
  if (!CITY_COORDINATES[origin] || !CITY_COORDINATES[destination]) {
    alert('Please select valid cities.');
    return;
  }
  if (isNaN(weight) || weight <= 0) {
    alert('Please enter a valid weight.');
    return;
  }
  // Calculate distance
  const coord1 = CITY_COORDINATES[origin];
  const coord2 = CITY_COORDINATES[destination];
  const distance = haversineDistance(coord1.lat, coord1.lon, coord2.lat, coord2.lon);
  // Rate and emissions factors per mode (per ton‑mile)
  const ratePerTonMile = {
    truck: 2.0,
    rail: 0.8,
    air: 5.5,
  };
  const carbonPerTonMile = {
    truck: 0.16, // kg CO2 per ton‑mile approx.
    rail: 0.045,
    air: 0.6,
  };
  const cost = distance * weight * ratePerTonMile[mode];
  const emissionsKg = distance * weight * carbonPerTonMile[mode];
  // Format numbers
  const formatCurrency = (num) => {
    return '$' + num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  const formatNumber = (num) => {
    return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  // Render results
  costEl.textContent = `${formatCurrency(cost)}`;
  distEl.textContent = `Distance: ${formatNumber(distance)} miles`;
  emissionsEl.textContent = `Estimated emissions: ${formatNumber(emissionsKg)} kg CO₂`;
  resultContainer.style.display = 'block';
}

// Contact form handler
function handleContact() {
  const successMsg = document.getElementById('contactSuccess');
  successMsg.style.display = 'block';
  // Reset form fields
  document.getElementById('contactForm').reset();
}

// Carrier sign‑up handler
function handleCarrierSignup() {
  const successMsg = document.getElementById('carrierSuccess');
  successMsg.style.display = 'block';
  document.getElementById('carrierForm').reset();
}

// Login handler (demo only)
function handleLogin() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const successAlert = document.getElementById('loginSuccess');
  const errorAlert = document.getElementById('loginError');
  // Simple placeholder validation: any non‑empty credentials accepted
  if (email && password.length >= 6) {
    successAlert.style.display = 'block';
    errorAlert.style.display = 'none';
  } else {
    errorAlert.style.display = 'block';
    successAlert.style.display = 'none';
  }
  // Optionally clear password field
  document.getElementById('loginPassword').value = '';
}