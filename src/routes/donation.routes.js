const express = require("express");
const router = express.Router();
const Donar = require("../models/donar.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Ngo = require("../models/ngo.js")
const { authenticateToken , forHome} = require("../middleware.js");

const donationController = require("../controllers/donation.controller.js")

router.get("/", authenticateToken , donationController.foodForm);

router.post("/", authenticateToken , donationController.foodCreated)

router.get("/showNgo", authenticateToken , donationController.showNgo);

router.get("/showNgo/:ngoId", authenticateToken ,  donationController.confirmationForm);

router.post("/showNgo/:ngoId/ngo_dashboard", authenticateToken ,donationController.confirmed);

module.exports = router;