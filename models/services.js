const mongoose = require("mongoose");
const serviceSchema = new mongoose.Schema({
  service_id: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  category: {
   type: String
    },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number
  },
  img: {
    type: String
  },
  creator:{
    type: String
  }
});

module.exports = mongoose.model("Services", serviceSchema);