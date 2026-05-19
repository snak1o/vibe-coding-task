const Slot = require("../models/Slot");
const Appointment = require("../models/Appointment");

exports.createAppointment = async (req, res) => {
  try {
    const { slotId } = req.body;

    // validate required fields
    if (!slotId) {
      return res.status(400).json({ message: "Missing slotId" });
    }

    //find slot
    const slot = await Slot.findById(slotId);

    //check if slot exists
    if (!slot) {
      return res.status(404).json({
        message: "Slot was not found"
      });
    }

    //check if slot is already booked
    if (slot.isBooked) {
      return res.status(400).json({
        message: "Slot is already booked"
      });
    }

    //creates an appointment
    const appointment = new Appointment({
      slot: slotId,
      user: req.user.userId
    });

    await appointment.save();

    //marks slot as booked
    slot.isBooked = true;
    await slot.save();

    res.status(201).json(appointment);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error"
    });
  }
};

// Get all appointments for the logged-in user
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user.userId })
      .populate("slot");

    res.status(200).json(appointments);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all appointments (admin)
exports.getAllAppointments = async (req, res) => {

  try {

    const appointments = await Appointment.find()
      .populate("user")
      .populate("slot");

    res.status(200).json(appointments);

  } catch (err) {

    res.status(500).json({
      message: "Server error"
    });
  }
};
// delete appointment by ID
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // check that user owns this appointment
    if (appointment.user.toString() !== req.user.userId &&
    req.user.role !== "admin"
    ) {
    return res.status(403).json({
    message: "Not authorized"
    });
  }

    // free the slot
    const slot = await Slot.findById(appointment.slot);
    if (slot) {
      slot.isBooked = false;
      await slot.save();
    }

    await Appointment.findByIdAndDelete(id);

    res.status(200).json({ message: "Appointment deleted" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};