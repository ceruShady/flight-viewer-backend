const express = require("express");
const router = express.Router();
const flightPlanController = require("../controllers/flightplan");

router.get("/list", flightPlanController.getFlights);
router.get("/plan/:fid", flightPlanController.getFlightPlan);

module.exports = router;
