require("dotenv").config;
const express = require("express");
const Users = require("../models/users");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  getUser
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
app.get("/:id", auth, async(req, res, next) => {
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
app.put("/:id",auth, async (req, res, next) => {
  const user = await Users.findById(req.user._id)
  const {
    name,
    contact,
    email,
    password,
    address
  } = req.body;
  if (name) user.name = name;
  if (contact) user.contact = contact;
  if (address) user.address = address;
  if (email) user.email = email;
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
app.delete("/:id", auth, async (req, res, next) => {
  try {
    await res.user.remove();
    res.json({ message: "Deleted user" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = app;