const express = require("express");
const router = express.Router();
const { getSchedules } = require("../controllers/scheduleController");

router.get("/schedules/:routeId", getSchedules);

module.exports = router;
