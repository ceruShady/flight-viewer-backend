const express = require("express");
const router = express.Router();
const geopointsController = require("../controllers/geopoints");

router.get("/fixes", geopointsController.getFixes);
router.get("/airways", geopointsController.getAirways);

module.exports = router;
