const express = require("express");
const mongoose = require("mongoose");
const mongoSanitize = require("express-mongo-sanitize");
const path = require("path");

require ('dotenv').config();

const app = express();
const PORT = 3000;

/// MIDDLEWARE
//Parse json request bodies
app.use(express.json());
// Prevent mongoDB operator injection !! Disabled temporarily cos of compatibility issues 
//app.use(mongoSanitize());
//get frontend files from public folder
app.use(express.static(path.join(__dirname, "public")));
// app.use(mongoSanitize());


///Route imports
//import authentication routes, login & register endpoints
const authRoutes = require("./routes/authRoutes");
//routes for slot management
const slotRoutes = require("./routes/slots");
//routes for appointment management
const appointmentRoutes = require("./routes/appRoutes");

///API routes
//use auth routes with base path /api/auth
app.use("/api/auth", authRoutes);
// Slot routes
app.use("/api/slots", slotRoutes);
// Appointment routes
app.use("/api/appointments", appointmentRoutes);


///Default route to frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  res.status(500).json({ message: "Internal server error" });
});

// Mongodb connection
const DBUSER = process.env.DBUSER;
const DBPASSWORD = process.env.DBPASSWORD;

const URI = `mongodb+srv://${DBUSER}:${DBPASSWORD}@node-project.7lsqvu9.mongodb.net/?appName=node-project`;


///start server after DB connection
mongoose.connect(URI)
  .then(() => {
    console.log("Connected to DB");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

