require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const Database = require("./config/database");
const mongoose = require("mongoose");
const ticketRoutes = require("./routes/tickets");

const PORT = process.env.PORT || 4000;
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.0rkt5ow.mongodb.net/customerSupport?retryWrites=true&w=majority`;
const db = new Database(MONGODB_URI);

db.connect()
  .then(() => console.log("Connected to database: customerSupport"))
  .catch((err) => console.error("Error connecting to database:", err));

// Ensure uploads directory exists on startup
const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(uploadsPath));

// Support ticket route
app.use("/tickets", ticketRoutes);

app.get("/server-status", (req, res) => {
  res.status(200).json({ message: "Server is up and running!" });
});

app.listen(PORT, () => console.log(`Server up and running on port ${PORT}!`));
