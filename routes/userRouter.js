require("dotenv").config;
const express = require("express");
const Users = require("../models/users");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  getUser, getMechanic, getService
} = require("../middleware/finders");

const app = express.Router();

// GET all users
app.get("/", async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).json({
      message: "SUCCESS",
      results: users
    });
  } catch (error) {
    res.status(500).send({
      message: error.message
    });
  }
});

// GET one user
app.get("/single-user/", auth, async(req, res, next) => {
  try {
    const user = await Users.findById(req.user._id)
  res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// LOGIN user with email + password
app.patch("/", async (req, res, next) => {
  const {
    email,
    password
  } = req.body;
  const user = await Users.findOne({
    email
  });

  if (!user) res.status(404).json({
    message: "Could not find user"
  });
  if (await bcrypt.compare(password, user.password)) {
    try {
      const access_token = jwt.sign(
        JSON.stringify(user),
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
  } else {
    res
      .status(400)
      .json({
        message: "Email and password combination do not match"
      });
  }
});

// REGISTER a user
app.post("/", async (req, res, next) => {
  const {
    name,
    email,
    password,
    contact,
    address,
    vehicles

  } = req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new Users({
    name,
    email,
    password: hashedPassword,
    contact,
    address,
    vehicles
  });

  try {
    const newUser = await user.save();

    try {
      const access_token = jwt.sign(
        JSON.stringify(newUser),
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

// UPDATE a user
app.put("/",auth, async (req, res, next) => {
  const user = await Users.findById(req.user._id)
  const {
    name,
    contact,
    password,
    address
  } = req.body;
  if (name) user.name = name;
  if (contact) user.contact = contact;
  if (address) user.address = address;
  if (password) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
  }
  try {
    const updatedUser = await user.save();
    try {
      const token = jwt.sign(
        JSON.stringify(updatedUser),
        process.env.ACCESS_TOKEN_SECRET
      );
      res.status(201).json({ jwt: token, user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
    // Dont just send user as object, create a JWT and send that too.
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a user
app.delete("/:id", getUser, async (req, res, next) => {
  try {
    const user = await Users.findById(req.user._id)
    await user.remove();
    res.json({ message: "Deleted user" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//BOOKINGS

// New Booking
app.post("/:id/", [auth, getService, getMechanic], async (req, res, next) => {
  const user = await Users.findById(req.user._id);
  // console.log(user)
  let user_id = req.user._id;
  let name = res.user.name;
  let contact = res.user.contact;
  let vehicle = res.user.vehicle;
  let address = res.user.address;
  let service_id = res.service._id;
  let mech_name = res.mechanic.name;
  let category = res.service.category;
  let img = res.service.img;
  let price = res.service.price;
  let booking_date = req.body;
  

  try {
    user.bookings.push({
      user_id,
      name,
      vehicle,
      address,
      contact,
      mechanic_id,
      mech_name,
      service_id,
      service_title,
      category,
      img,
      price,
      booking_date,
     
    });
    const updatedUser = await user.save();
    res.status(201).json(updatedUser);
  } catch (error) {
    res.status(500).json(console.log(error));
  }
});



module.exports = app;