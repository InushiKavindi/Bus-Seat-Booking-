const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/schedules/:routeId", (req, res) => {
  const routeId = req.params.routeId;
  const sql = `
    SELECT s.schedule_id, s.travel_date, s.travel_time, b.bus_name
    FROM schedules s
    JOIN buses b ON s.bus_id = b.bus_id
    WHERE s.route_id = ?
  `;

  db.query(sql, [routeId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

module.exports = router;
