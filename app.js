const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT;

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
app.use("/api/geopoints", geopointsRoute);

app.listen(PORT, () => {
  console.log(`Application started as PORT ${PORT}`);
});
