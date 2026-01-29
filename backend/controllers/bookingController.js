const db = require("../db");

exports.createBooking = (req, res) => {
  const { schedule_id, seat_no, passenger_name, phone } = req.body;

  if (!schedule_id || !seat_no || !passenger_name || !phone) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const getScheduleSql = "SELECT bus_id FROM schedules WHERE schedule_id = ?";
  db.query(getScheduleSql, [schedule_id], (err, scheduleRows) => {
    if (err) return res.status(500).json({ error: "DB error", details: err });
    if (scheduleRows.length === 0) return res.status(404).json({ error: "Schedule not found" });

    const busId = scheduleRows[0].bus_id;
    const getSeatSql = "SELECT seat_id FROM seats WHERE bus_id = ? AND seat_no = ?";
    db.query(getSeatSql, [busId, seat_no], (err, seatRows) => {
      if (err) return res.status(500).json({ error: "DB error", details: err });
      if (seatRows.length === 0) return res.status(404).json({ error: "Seat not found for bus" });

      const seatId = seatRows[0].seat_id;
      const checkSql = "SELECT booking_id FROM bookings WHERE schedule_id = ? AND seat_id = ? AND booking_status = 'confirmed'";
      db.query(checkSql, [schedule_id, seatId], (err, existingRows) => {
        if (err) return res.status(500).json({ error: "DB error", details: err });
        if (existingRows.length > 0) return res.status(409).json({ error: "Seat already booked" });

        const insertSql = "INSERT INTO bookings (schedule_id, seat_id, passenger_name, phone) VALUES (?, ?, ?, ?)";
        db.query(insertSql, [schedule_id, seatId, passenger_name, phone], (err, result) => {
          if (err) return res.status(500).json({ error: "DB error", details: err });
          return res.status(201).json({ booking_id: result.insertId, message: "Booking confirmed" });
        });
      });
    });
  });
};

// User endpoint: disallow changing seat after confirmation
exports.updateBookingSeat = (req, res) => {
  return res.status(403).json({ error: "Only admin can change seat" });
};
