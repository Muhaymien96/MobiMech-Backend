require("dotenv").config;
const express = require("express");
const Bookings = require("../models/bookings");
const auth = require("../middleware/auth");
const { getMechanic, getBooking, getService } = require("../middleware/finders");
const app = express.Router();
// GET all bookings

app.get("/", getBooking, async (req, res) => {
  try {
    const booking = await Bookings.find();
    res.status(201).send(booking);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

// GET one booking
app.get("/:id", [auth, getBooking], (req, res, next) => {
  res.send(res.booking);
});

// CREATE a booking
app.post("/", [auth, getMechanic, getService], async (req, res, next) => {
  const {booking_date, special_instructions, service_by, created_by, address } = req.body;
  let booking;
  img
    ? (booking = new Bookings({
      booking_date,
      special_instructions, 
      service_by, 
      address,
      created_by
      
      }))
    : (booking = new Bookings({
      booking_date, 
      address,
      special_instructions, 
      service_by: res.mechanic._id, 
      created_by: req.user._id
      }));

  try {
    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a booking
app.put("/:id", [auth, getService], async (req, res, next) => {
  const { booking_date, special_instructions} = req.body;
  if (booking_date) res.booking.booking_date = booking_date;
  if (address) res.booking.address = address;
  if (special_instructions) res.booking.special_instructions = special_instructions;
  
  try {
    const updatedBooking = await res.booking.save();
    res.status(201).send(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a booking
app.delete("/:id", [auth, getService], async (req, res, next) => {
  if (req.user._id !== req.booking.creator)
    res
      .status(400)
      .json({ message: "You do not have the permission to delete this booking" });
  try {
    await res.booking.remove();
    res.status(201).json({ message: "Deleted booking" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = app;
