const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  join_date: {
    type: Date,
    default: Date.now,
  },
  address: {
    type: String,
    required: true
  },
  isAdmin:{
    type: Boolean,
    default: false
  },
  vehicles: [
    {
      trim_id: {
        type: String
      },
      make: {
      type: String
      },
      model: {
      type: String
      },
      year: {
        type: String
      }
    }
  ],
  bookings:{
    type: Array,
    default: []
  }
});

module.exports = mongoose.model("Users", userSchema);