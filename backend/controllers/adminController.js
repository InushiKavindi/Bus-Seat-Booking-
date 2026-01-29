const db = require("../db");

exports.addSchedule = (req, res) => {
  const { route_id, bus_id, arrival_time, departure_time, type, status } = req.body;
  if (!route_id || !bus_id || !arrival_time || !departure_time || !type) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const effectiveStatus = status !== undefined ? status : 1;
  const sql = "INSERT INTO schedules (route_id, bus_id, arrival_time, departure_time, type, status) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [route_id, bus_id, arrival_time, departure_time, type, effectiveStatus], (err, result) => {
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
      s.arrival_time,
      s.departure_time,
      r.route_no,
      cf.city_name AS from_city_name,
      ct.city_name AS to_city_name,
      bus.bus_no,
      seat.seat_no
    FROM bookings b
    JOIN schedules s ON b.schedule_id = s.schedule_id
    JOIN routes r ON s.route_id = r.route_id
    JOIN cities cf ON r.from_city = cf.city_id
    JOIN cities ct ON r.to_city = ct.city_id
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

// Admin override: allow changing seat even if confirmed, but keep seat availability rules
exports.adminUpdateBookingSeat = (req, res) => {
  const bookingId = req.params.id;
  const { seat_no } = req.body;

  if (!seat_no) return res.status(400).json({ error: "seat_no is required" });

  const getBookingSql = "SELECT schedule_id FROM bookings WHERE booking_id = ?";
  db.query(getBookingSql, [bookingId], (err, bookingRows) => {
    if (err) return res.status(500).json({ error: "DB error", details: err });
    if (bookingRows.length === 0) return res.status(404).json({ error: "Booking not found" });

    const scheduleId = bookingRows[0].schedule_id;
    const getBusSql = "SELECT bus_id FROM schedules WHERE schedule_id = ?";
    db.query(getBusSql, [scheduleId], (err, scheduleRows) => {
      if (err) return res.status(500).json({ error: "DB error", details: err });
      if (scheduleRows.length === 0) return res.status(404).json({ error: "Schedule not found" });

      const busId = scheduleRows[0].bus_id;
      const getSeatSql = "SELECT seat_id FROM seats WHERE bus_id = ? AND seat_no = ?";
      db.query(getSeatSql, [busId, seat_no], (err, seatRows) => {
        if (err) return res.status(500).json({ error: "DB error", details: err });
        if (seatRows.length === 0) return res.status(404).json({ error: "Seat not found for bus" });

        const newSeatId = seatRows[0].seat_id;
        const conflictSql = "SELECT booking_id FROM bookings WHERE schedule_id = ? AND seat_id = ? AND booking_status = 'confirmed' AND booking_id <> ?";
        db.query(conflictSql, [scheduleId, newSeatId, bookingId], (err, conflictRows) => {
          if (err) return res.status(500).json({ error: "DB error", details: err });
          if (conflictRows.length > 0) return res.status(409).json({ error: "Seat already booked" });

          const updateSql = "UPDATE bookings SET seat_id = ? WHERE booking_id = ?";
          db.query(updateSql, [newSeatId, bookingId], (err) => {
            if (err) return res.status(500).json({ error: "DB error", details: err });
            return res.json({ message: "Seat updated by admin" });
          });
        });
      });
    });
  });
};
