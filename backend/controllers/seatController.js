const db = require("../db");

exports.getSeats = (req, res) => {
  const scheduleId = req.params.scheduleId;

  const getScheduleSql = "SELECT bus_id FROM schedules WHERE schedule_id = ?";
  db.query(getScheduleSql, [scheduleId], (err, scheduleRows) => {
    if (err) return res.status(500).json({ error: "DB error", details: err });
    if (scheduleRows.length === 0) return res.status(404).json({ error: "Schedule not found" });

    const busId = scheduleRows[0].bus_id;

    const seatsSql = "SELECT seat_id, seat_no FROM seats WHERE bus_id = ? ORDER BY CAST(seat_no AS UNSIGNED)";
    db.query(seatsSql, [busId], (err, seatRows) => {
      if (err) return res.status(500).json({ error: "DB error", details: err });

      const bookedSql = "SELECT seat_id FROM bookings WHERE schedule_id = ? AND booking_status = 'confirmed'";
      db.query(bookedSql, [scheduleId], (err, bookedRows) => {
        if (err) return res.status(500).json({ error: "DB error", details: err });

        const bookedSet = new Set(bookedRows.map((r) => r.seat_id));
        const seats = seatRows.map((s) => ({
          seat_id: s.seat_id,
          seat_no: s.seat_no,
          status: bookedSet.has(s.seat_id) ? "booked" : "available",
        }));

        res.json({ schedule_id: Number(scheduleId), bus_id: busId, seats });
      });
    });
  });
};
