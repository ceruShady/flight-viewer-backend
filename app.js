const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: "*",
  methods: "GET",
  allowedHeader: "Content-Type",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const flightPlanRoute = require("./routes/flightplan");
const geopointsRoute = require("./routes/geopoints");

app.use("/api/flightplan", flightPlanRoute);
// app.use("/api/geopoints", geopointsRoute);

// Error handling middleware
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;

  res.status(status).json({ message: message });
});

app.listen(PORT, () => {
  console.log(`Application started as PORT ${PORT}`);
});
