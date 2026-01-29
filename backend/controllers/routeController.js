const db = require("../db");

exports.getRoutes = (req, res) => {
  const sql = "SELECT * FROM routes";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// Get all active cities for dropdowns
exports.getCities = (req, res) => {
  const sql = "SELECT city_id, city_name FROM cities WHERE status = 1 ORDER BY city_name";
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: "DB error", details: err });
    res.json(rows);
  });
};

// Get a route by from_city and to_city (IDs), include city names
exports.getRouteByCities = (req, res) => {
  const from = req.query.from;
  const to = req.query.to;

  if (!from || !to) {
    return res.status(400).json({ error: "Missing query params: from, to" });
  }

  const sql = `
    SELECT r.route_id, r.route_no,
           r.from_city AS from_city_id, r.to_city AS to_city_id,
           cf.city_name AS from_city_name,
           ct.city_name AS to_city_name
    FROM routes r
    JOIN cities cf ON r.from_city = cf.city_id
    JOIN cities ct ON r.to_city = ct.city_id
    WHERE r.from_city = ? AND r.to_city = ?
  `;
  db.query(sql, [from, to], (err, rows) => {
    if (err) return res.status(500).json({ error: "DB error", details: err });
    res.json(rows);
  });
};
