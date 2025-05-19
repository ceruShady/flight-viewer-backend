const axios = require("axios");

const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;

//Require current page (optional)
// Need to return total amount of flights and current page
// Optional query:
// - search term: String (Default "")
// - page: Number (Default 1)
// - perpage: Number (Default 10)
exports.getFlights = async (req, res) => {
  let searchTerm = req.query.search || "";
  const page = Number(req.query.page) || 1;
  const perpage = Number(req.query.perpage) || 10;

  const response = await axios.get(`${API_URL}/flight-manager/displayAll`, {
    headers: { apikey: API_KEY },
  });

  let fliteredPlans;

  if (searchTerm) {
    searchTerm = searchTerm.toLowerCase();
    fliteredPlans = response.data.filter((flight) =>
      flight.aircraftIdentification.toLowerCase().includes(searchTerm)
    );
  } else {
    fliteredPlans = response.data;
  }

  const startIndex = (page - 1) * perpage;
  const endIndex = page * perpage;
  const pagePlans = fliteredPlans.slice(startIndex, endIndex);

  const result = pagePlans.map((flightplan) => {
    return {
      _id: flightplan._id,
      aircraftIdentification: flightplan.aircraftIdentification,
      departureDate: flightplan.departure.dateOfFlight,
      departureTime: flightplan.departure.timeOfFlight,
    };
  });
  console.log(result);

  res.status(200).json({
    total_result: fliteredPlans.length,
    totalPage: Math.ceil(fliteredPlans.length / perpage),
    page: page,
    result: result,
  });
};

exports.getFlightPlan = async (req, res) => {
  const flightId = req.params.fid;

  // Get all flight plan
  const flightResponse = await axios.get(
    "https://api.swimapisg.info/flight-manager/displayAll",
    { headers: { apikey: API_KEY } }
  );

  // find first matching _id in the list
  const flightPlan = flightResponse.data.find((flight) => {
    return flight._id === flightId;
  });

  // Error handling: Flight not found
  if (!flightPlan) {
    console.error("Flight plan not found");
  }
  console.log(flightPlan);

  // Prep array of designated point array from the flight plan
  const designatedArr = [];

  // Need to account for cases with no designated point

  flightPlan.filedRoute.routeElement.forEach((routeEle) => {
    if (routeEle.position?.designatedPoint)
      designatedArr.push(routeEle.position.designatedPoint);
    else {
      console.error("Route element does not have position property");
    }
  });

  // res.json(designatedArr);

  // Get all fixes
  const fixesResponse = await axios.get(
    "https://api.swimapisg.info/geopoints/list/fixes",
    { headers: { apikey: API_KEY } }
  );
  // Get list of matching position designation point in the list of fixes
  // Extract lat and lon to create an array of position object consisting of designation and position

  const finalArr = [];
  let posStr;
  let posArr;

  designatedArr.forEach((designated) => {
    posStr = fixesResponse.data.find((fix) => fix.split(" ")[0] === designated);
    if (posStr) {
      posStr = posStr.split(" ")[1];

      posArr = posStr.substring(1, posStr.length - 1).split(",");

      finalArr.push({
        designatedPoint: designated,
        position: [Number(posArr[0]), Number(posArr[1])],
      });
    } else {
      console.error(`Fix data: ${designated} not found`);
    }
  });

  res.status(200).json(finalArr);
  // res.status(200).json(flightPlan);
};
