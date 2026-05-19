const Slot = require("../models/Slot");

// helper for date and time validation
function isValidISODate(dateString) {
    const date = new Date(dateString);

    return !isNaN(date.getTime());
}

// Create a new slot
exports.createSlot = async (req, res) => {
    try {
        const { start, end } = req.body;

        if (!start || !end) {
            return res.status(400).json({ message: "Missing start/end" });
        }

        // check the time format from startdate and end-date
        if (!isValidISODate(start) || !isValidISODate(end)) {
            return res.status(400).json({
                message: "Invalid date format"
            });
        }

        // transform to date objects
        const startDate = new Date(start);
        const endDate = new Date(end);

        // check if ending time is given after the start
        if (endDate <= startDate) {
            return res.status(400).json({
                message: "End time must be after start time"
            });
        }

        const slot = await Slot.create({
            start: startDate,
            end: endDate
        });


        res.status(201).json(slot);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Update the start / end time of created slot
exports.updateSlot = async (req, res) => {
    try {
        const { id } = req.params;
        const { start, end } = req.body;

        // check that even one field is updated
        if (!start && !end) {
            return res.status(400).json({ message: "Nothing to update" });
        }

        const updatedSlot = await Slot.findByIdAndUpdate(
            id,
            { start, end },
            { new: true, runValidators: true }
        );

        if (!updatedSlot) {
            return res.status(404).json({ message: "Slot not found" });
        }

        res.status(200).json(updatedSlot);

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Get a single slot by ID
exports.getSlot = async (req, res) => {
    try {
        const { id } = req.params;

        const slot = await Slot.findById(id);

        if (!slot) {
            return res.status(404).json({ message: "Slot not found" });
        }

        res.status(200).json(slot);

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Get all slots
exports.getSlots = async (req, res) => {
    try {
        const slots = await Slot.find();
        res.status(200).json(slots);

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Delete slot by ID
exports.deleteSlot = async (req, res) => {
    try {
        const { id } = req.params;

        const slot = await Slot.findByIdAndDelete(id);

        if (!slot) {
            return res.status(404).json({ message: "Slot not found" });
        }

        res.status(200).json({ message: "Slot deleted" });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

function slotAvailability() {
    
}