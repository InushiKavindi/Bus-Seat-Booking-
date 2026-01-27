const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/routes", (req, res) => {
  const sql = "SELECT * FROM routes";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

module.exports = router;
