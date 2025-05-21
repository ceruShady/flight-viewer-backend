const axios = require("axios");

const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;

exports.getFlights = async (req, res, next) => {
  let searchTerm = req.query.search || "";
  let page = Number(req.query.page) || 1;
  if (page < 1) page = 1;

  const perpage = Number(req.query.perpage) || 10;

  let response;
  let fliteredPlans;

  try {
    response = await axios.get(`${API_URL}/flight-manager/displayAll`, {
      headers: { apikey: API_KEY },
    });
  } catch (err) {
    console.error("ERROR: " + err.message);
    const error = new Error("Unable to get flight list");
    error.statusCode = 404;
    throw error;
  }

  if (searchTerm) {
    searchTerm = searchTerm.toLowerCase();
    fliteredPlans = response.data.filter((flight) =>
      flight.aircraftIdentification.toLowerCase().includes(searchTerm)
    );
  } else {
    fliteredPlans = response.data;
  }

  const totalPage = Math.ceil(fliteredPlans.length / perpage);
  if (page > totalPage) page = totalPage;

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

  res.status(200).json({
    total_result: fliteredPlans.length,
    totalPage: totalPage,
    page: page,
    result: result,
  });
};

exports.getFlightPlan = async (req, res, next) => {
  const flightId = req.params.fid;

  let flightResponse;

  try {
    flightResponse = await axios.get(`${API_URL}/flight-manager/displayAll`, {
      headers: { apikey: API_KEY },
    });
  } catch (err) {
    console.error("ERROR: " + err.message);
    const error = new Error("Unable to get flight plan");
    error.statusCode = 404;
    throw error;
  }

  const flightPlan = flightResponse.data.find((flight) => {
    return flight._id === flightId;
  });

  if (!flightPlan) {
    const err = new Error("Flight plan not found");
    err.statusCode = 404;
    throw err;
  }

  if (!flightPlan.filedRoute) {
    const err = new Error("Flight plan does not have a filed route");
    err.statusCode = 404;
    throw err;
  }

  const designatedArr = [];

  flightPlan.filedRoute.routeElement.forEach((routeEle) => {
    if (routeEle.position?.designatedPoint)
      designatedArr.push(routeEle.position.designatedPoint);
    else {
      console.error("ERROR: Route element does not have position property");
    }
  });

  let fixesResponse;
  try {
    fixesResponse = await axios.get(`${API_URL}/geopoints/list/fixes`, {
      headers: { apikey: API_KEY },
    });
  } catch (err) {
    console.error("ERROR: " + err.message);
    const error = new Error("Unable to get fixes data");
    error.statusCode = 404;
    throw error;
  }

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
      console.error(`ERROR: Fix data: ${designated} not found`);
    }
  });

  res.status(200).json(finalArr);
};
