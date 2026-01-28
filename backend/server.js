const express = require("express");
const cors = require("cors");
const db = require("./db");
const routeRoutes = require("./routes/routeRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const seatRoutes = require("./routes/seatRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");



const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", routeRoutes);
app.use("/api", scheduleRoutes);
app.use("/api", seatRoutes);
app.use("/api", bookingRoutes);
app.use("/api", adminRoutes);

app.get("/", (req, res) => {
  res.send("Bus Booking API Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
