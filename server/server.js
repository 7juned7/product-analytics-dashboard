const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import CORS middleware
const Papa = require('papaparse');

const app = express();
const port = process.env.PORT || 5000;

// Use CORS middleware
app.use(cors());

app.get('/', (req, res) => {
    res.send('API is working!');
});
// Correct the endpoint
app.get('/api/data', async (req, res) => {
    const url = 'https://docs.google.com/spreadsheets/d/1l7GstWHc69HPV0irSdvoMIyHgtufUPKsbtCiNw7IKR0/gviz/tq?tqx=out:csv';

    try {
        const response = await axios.get(url);

        // Parse the CSV data using PapaParse
        const parsedData = Papa.parse(response.data, { header: true });

        // Send the parsed data as JSON
        res.json(parsedData.data); // parsedData.data contains the rows
    } catch (error) {
        console.error('Error in fetching the data:', error.message);
        res.status(500).send('Error fetching data');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
