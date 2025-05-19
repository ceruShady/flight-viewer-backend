const axios = require("axios");

const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;

exports.getFixes = async (req, res) => {
  const response = await axios.get(`${API_URL}/geopoints/list/fixes`, {
    headers: { apikey: API_KEY },
  });

  res.json(response.data);
};

exports.getAirways = async (req, res) => {
  const response = await axios.get(`${API_URL}/geopoints/list/airways`, {
    headers: { apikey: API_KEY },
  });

  res.json(response.data);
};
