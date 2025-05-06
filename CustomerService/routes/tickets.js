const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Mongoose Schema
const ticketSchema = new mongoose.Schema({
  query: { type: String, required: true },
  attachmentUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["Open", "Pending", "Resolved"],
    default: "Open",
  },
});
const Ticket = mongoose.model("Ticket", ticketSchema);

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// POST /tickets
router.post("/", upload.single("attachment"), async (req, res) => {
  try {
    console.log("Hello");
    const { query } = req.body;
    const ticketData = { query };
    if (req.file) {
      ticketData.attachmentUrl = `/uploads/${req.file.filename}`;
    }

    const ticket = await Ticket.create(ticketData);
    res
      .status(201)
      .json({ message: "Ticket raised successfully!", ticketId: ticket._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create ticket." });
  }
});

module.exports = router;
