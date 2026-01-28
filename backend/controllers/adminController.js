const db = require("../db");

exports.addSchedule = (req, res) => {
  const { route_id, bus_id, travel_date, travel_time } = req.body;
  if (!route_id || !bus_id || !travel_date || !travel_time) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = "INSERT INTO schedules (route_id, bus_id, travel_date, travel_time) VALUES (?, ?, ?, ?)";
  db.query(sql, [route_id, bus_id, travel_date, travel_time], (err, result) => {
    if (err) return res.status(500).json({ error: "DB error", details: err });
    res.status(201).json({ schedule_id: result.insertId });
  });
};

exports.getAllBookings = (req, res) => {
  const sql = `
    SELECT 
      b.booking_id,
      b.booking_status,
      b.booking_time,
      b.passenger_name,
      b.phone,
      s.schedule_id,
      s.travel_date,
      s.travel_time,
      r.from_city,
      r.to_city,
      bus.bus_name,
      seat.seat_no
    FROM bookings b
    JOIN schedules s ON b.schedule_id = s.schedule_id
    JOIN routes r ON s.route_id = r.route_id
    JOIN buses bus ON s.bus_id = bus.bus_id
    JOIN seats seat ON b.seat_id = seat.seat_id
    ORDER BY b.booking_time DESC
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: "DB error", details: err });
    res.json(rows);
  });
};

exports.cancelBooking = (req, res) => {
  const bookingId = req.params.id;
  const checkSql = "SELECT booking_id FROM bookings WHERE booking_id = ?";
  db.query(checkSql, [bookingId], (err, rows) => {
    if (err) return res.status(500).json({ error: "DB error", details: err });
    if (rows.length === 0) return res.status(404).json({ error: "Booking not found" });

    const updateSql = "UPDATE bookings SET booking_status = 'cancelled' WHERE booking_id = ?";
    db.query(updateSql, [bookingId], (err) => {
      if (err) return res.status(500).json({ error: "DB error", details: err });
      res.json({ message: "Booking cancelled" });
    });
  });
};
