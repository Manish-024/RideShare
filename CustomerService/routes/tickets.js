const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Ticket = require("../models/Ticket");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

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
    const { query, userId } = req.body;
    const ticketData = { query, userId };

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

// GET /tickets?userId=...
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId query parameter." });
    }

    const tickets = await Ticket.find({ userId }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tickets." });
  }
});

module.exports = router;
