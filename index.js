const express = require('express');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Cache the JSON data
let medicinesData;
fs.readFile('medicine.json', (err, data) => {
  if (err) {
    console.error('Failed to load medicines data:', err);
    process.exit(1);
  } else {
    medicinesData = JSON.parse(data); // Parse and cache the data
    console.log('Medicines data loaded successfully.');
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Medicines API! Use /api/medicine to view all medicines.');
});

// Route to get all medicines
app.get('/api/medicine', (req, res) => {
  if (!medicinesData) {
    return res.status(500).json({ error: 'Medicines data not available.' });
  }
  res.json(medicinesData); // Return the entire medicines array
});

// Route to get a specific medicine by name
app.get('/api/medicine/:name', (req, res) => {
  const medicineName = req.params.name.toLowerCase();

  if (!medicinesData) {
    return res.status(500).json({ error: 'Medicines data not available.' });
  }

  const medicine = medicinesData.find((med) => med.name.toLowerCase() === medicineName);

  if (medicine) {
    res.json(medicine);
  } else {
    res.status(404).json({ error: `Medicine "${req.params.name}" not found.` });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
