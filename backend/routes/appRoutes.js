const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const {
    createAppointment,
    getAppointments,
    getAppointment,
    cancelAppointment,
    getMyAppointments,
    getAllAppointments,
    deleteAppointment,
} = require("../controllers/appController");

// create new appointment
router.post("/", auth, createAppointment);

// get all appointments for the authorized user
router.get("/my", auth, getMyAppointments);

// delete appointment by ID
router.delete("/:id", auth, deleteAppointment);

module.exports = router;

// Admin: get all appointments
router.get(
  "/all",
  auth,
  authorize("admin"),
  getAllAppointments
);