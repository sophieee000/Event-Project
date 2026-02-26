const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: String,
  location: String,
  userId: String
});

module.exports = mongoose.model("Event", eventSchema);