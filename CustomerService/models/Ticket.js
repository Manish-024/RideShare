const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  query: { type: String, required: true },
  attachmentUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["Open", "Pending", "Resolved"],
    default: "Open",
  },
});

module.exports = mongoose.model("Ticket", ticketSchema);
