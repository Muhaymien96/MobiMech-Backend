const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  booking_id: {
    type: String
  },
  created_by: {
    type: String
  },
  service_by: {
    type: String
  },
  booking_date: {
    type: String,
    required: true
  },
  special_instructions: {
    type: String
  }
});

module.exports = mongoose.model("Bookings", bookingSchema);