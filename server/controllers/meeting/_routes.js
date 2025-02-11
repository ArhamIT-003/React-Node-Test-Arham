const express = require("express");
const {
  add,
  index,
  view,
  deleteData,
  deleteMany,
} = require("../../controllers/meeting/meeting.js");

const router = express.Router();

// Routes for Meeting History
router.post("/add", add); // Add a new meeting
router.get("/all", index); // Get all meetings
router.get("/:id", view); // Get a single meeting by ID
router.delete("/:id", deleteData); // Soft delete a meeting by ID
router.post("/delete-many", deleteMany); // Soft delete multiple meetings

module.exports = router;
