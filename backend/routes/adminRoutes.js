const express = require("express");
const router = express.Router();
const { addSchedule, getAllBookings, cancelBooking } = require("../controllers/adminController");

router.post("/admin/schedules", addSchedule);
router.get("/admin/bookings", getAllBookings);
router.put("/admin/bookings/:id/cancel", cancelBooking);

module.exports = router;
