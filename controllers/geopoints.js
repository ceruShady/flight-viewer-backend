const axios = require("axios");

const API_KEY = process.env.API_KEY;

exports.getFixes = async (req, res) => {
  const response = await axios.get(
    "https://api.swimapisg.info/geopoints/list/fixes",
    { headers: { apikey: API_KEY } }
  );

  res.json(response.data);
};

exports.getAirways = async (req, res) => {
  const response = await axios.get(
    "https://api.swimapisg.info/geopoints/list/airways",
    { headers: { apikey: API_KEY } }
  );

  res.json(response.data);
};
