const express = require("express");
const router = express.Router();
const { getRoutes, getRouteByCities } = require("../controllers/routeController");

router.get("/routes", getRoutes);
router.get("/routes/by-cities", getRouteByCities);

module.exports = router;
