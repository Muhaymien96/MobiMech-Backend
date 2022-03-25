require("dotenv").config;
const express = require("express");
const Services = require("../models/services");
const auth = require("../middleware/auth");
const { getService } = require("../middleware/finders");
const app = express.Router();

// GET all services
app.get("/", async (req, res) => {
  try {
    const service = await Services.find();
    res.status(201).send(service);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

// GET one service
app.get("/:id", [auth, getService], (req, res, next) => {
  res.send(res.service);
});

// CREATE a service
app.post("/", auth, async (req, res, next) => {
  const {title, category, description, price, img, creator } = req.body;
  let service;
  img
    ? (service = new Services({
      title, 
      category, 
      description, 
      img,
      price,
      creator
      
      }))
    : (service = new Services({
      title,
      category,
      description,
      price,
      img,
      creator: req.user._id
      }));

  try {
    const newService = await service.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a service
app.put("/:id", [auth, getService], async (req, res, next) => {
  const { title, category, description, price, img} = req.body;
  if (title) res.service.title = title;
  if (category) res.service.category = category;
  if (description) res.service.description = description;
  if (price) res.service.price = price;
  if (img) res.service.img = img;
  try {
    const updatedService = await res.service.save();
    res.status(201).send(updatedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a service
app.delete("/:id", [auth, getService], async (req, res, next) => {
  if (req.user._id !== res.service.creator)
    res
      .status(400)
      .json({ message: "You do not have the permission to delete this service" });
  try {
    await res.service.remove();
    res.status(201).json({ message: "Deleted service" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = app;
