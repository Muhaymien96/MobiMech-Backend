const mongoose = require("mongoose");

const mechanicSchema = new mongoose.Schema({
  mechanic_id: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  address_m: {
    type: String
  }
});

module.exports = mongoose.model("Mechanics", mechanicSchema);