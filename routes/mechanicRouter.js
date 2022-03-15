require("dotenv").config;
const express = require("express");
const Mechanics = require("../models/mechanics");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const {
  getMechanic
} = require("../middleware/finders");

const app = express.Router();

// GET all mechanics
app.get("/", async (req, res) => {
  try {
    const mechanics = await Mechanics.find();
    res.status(200).json({
      message: "SUCCESS",
      results: mechanics
    });
  } catch (error) {
    res.status(500).send({
      message: error.message
    });
  }
});

// GET one mechanic
app.get("/single-mechanic/", auth, async(req, res, next) => {
  try {
    const mechanic = await Mechanics.findById(req.mechanic._id)
  res.status(201).json(mechanic)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mechanic Sign up
app.post("/", async (req, res, next) => {
  const {
    name,
    email,
    contact,
    experience,
    address_m
  } = req.body;

  const mechanic = new Mechanics({
    name,
    email,
    contact,
    experience,
    address_m
  });

  try {
    const newMechanic = await mechanic.save();

    try {
      const access_token = jwt.sign(
        JSON.stringify(newMechanic),
        process.env.ACCESS_TOKEN_SECRET
      );
      res.status(201).json({
        jwt: access_token
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// UPDATE a mechanic
app.put("/",auth, async (req, res, next) => {
  const mechanic = await Mechanics.findById(req.mechanic._id)
  const {
    name,
    email,
    contact,
    experience,
    address_m
  
  } = req.body;
  if (name) mechanic.name = name;
  if (contact) mechanic.contact = contact;
  if (email) mechanic.email = email;
  if (experience) mechanic.experience = experience;
  if (address_m) mechanic.address_m = address_m;
  try {
    const updatedMechanic = await mechanic.save();

    try {
      const token = jwt.sign(
        JSON.stringify(updatedMechanic),
        process.env.ACCESS_TOKEN_SECRET
      );
      res.status(201).json({ jwt: token, mechanic: updatedMechanic });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
    // Dont just send mechanic as object, create a JWT and send that too.
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a mechanic
app.delete("/:id", getMechanic, async (req, res, next) => {
  try {
    const mechanic = await Mechanics.findById(req.mechanic._id)
    await mechanic.remove();
    res.json({ message: "Deleted mechanic" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = app;