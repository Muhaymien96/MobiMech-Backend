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
  address: {
    type: String
  },
  booking_date: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Bookings", bookingSchema);