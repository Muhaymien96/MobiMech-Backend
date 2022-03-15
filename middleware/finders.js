// This is used to find various Schemas
const Users = require("../models/users");
const Services = require("../models/services");
const Mechanics = require("../models/mechanics");

async function getUser(req, res, next) {
  let user;
  try {
    user = await Users.findById(req.params.id);

    if (!user) res.status(404).json({ message: "Could not find user" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  res.user = user;
  next();
}

async function getService(req, res, next) {
  let service;
  try {
    service = await Services.findById(req.params.id);
    if (!service) res.status(404).json({ message: "Could not find service" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  res.service = service;
  next();
}

async function getMechanic(req, res, next) {
  let mechanic;
  try {
    mechanic = await Mechanics.findById(req.params.id);
    if (!mechanic) res.status(404).json({ message: "Could not find mechanic" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  res.mechanic = mechanic;
  next();
}
module.exports = { getUser, getService, getMechanic};
