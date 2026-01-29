const express = require("express");
const router = express.Router();
const { getRoutes, getRouteByCities, getCities } = require("../controllers/routeController");

router.get("/routes", getRoutes);
router.get("/routes/by-cities", getRouteByCities);
router.get("/cities", getCities);

module.exports = router;
