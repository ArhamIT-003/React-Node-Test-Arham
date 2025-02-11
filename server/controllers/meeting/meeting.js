const MeetingHistory = require("../../model/schema/meeting");
const mongoose = require("mongoose");

// Add a new meeting
const add = async (req, res) => {
  try {
    const {
      agenda,
      attendes,
      attendesLead,
      location,
      related,
      dateTime,
      notes,
      createBy,
    } = req.body;

    console.log(req.body);
    if (!agenda || !createBy) {
      return res
        .status(400)
        .json({ message: "Agenda and Created By fields are required." });
    }

    const newMeeting = new MeetingHistory({
      agenda,
      attendes,
      attendesLead,
      location,
      related,
      dateTime,
      notes,
      createBy,
    });

    const savedMeeting = await newMeeting.save();
    res
      .status(201)
      .json({ message: "Meeting added successfully", meeting: savedMeeting });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding meeting", error: error.message });
  }
};

// Get all meetings
const index = async (req, res) => {
  try {
    const meetings = await MeetingHistory.find({ deleted: false })
      .populate("attendes")
      .populate("attendesLead")
      .populate("createBy");

    console.log(meetings);
    res.status(200).json(meetings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching meetings", error: error.message });
  }
};

// View a specific meeting by ID
const view = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Meeting ID" });
    }

    const meeting = await MeetingHistory.findById(id)
      .populate("attendes")
      .populate("attendesLead")
      .populate("createBy");

    if (!meeting || meeting.deleted) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    res.status(200).json(meeting);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching meeting details",
      error: error.message,
    });
  }
};

// Soft delete a meeting (mark as deleted)
const deleteData = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Meeting ID" });
    }

    const meeting = await MeetingHistory.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    res.status(200).json({ message: "Meeting deleted successfully", meeting });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting meeting", error: error.message });
  }
};

// Delete multiple meetings by IDs
const deleteMany = async (req, res) => {
  try {
    const { ids } = req.body; // Expecting an array of meeting IDs

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Invalid or empty ID list" });
    }

    const validIds = ids.filter((id) => mongoose.Types.ObjectId.isValid(id));

    const result = await MeetingHistory.updateMany(
      { _id: { $in: validIds } },
      { deleted: true }
    );

    res.status(200).json({ message: "Meetings deleted successfully", result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting meetings", error: error.message });
  }
};

module.exports = { add, index, view, deleteData, deleteMany };
