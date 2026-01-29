const express = require("express");
const router = express.Router();
const { addSchedule, getAllBookings, cancelBooking, adminUpdateBookingSeat, updateSchedule } = require("../controllers/adminController");

router.post("/admin/schedules", addSchedule);
router.put("/admin/schedules/:id", updateSchedule);
router.get("/admin/bookings", getAllBookings);
router.put("/admin/bookings/:id/cancel", cancelBooking);
router.put("/admin/bookings/:id/seat", adminUpdateBookingSeat);

module.exports = router;
