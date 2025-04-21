const express = require("express");
const router = express.Router();
const Donar = require("../models/donar.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Ngo = require("../models/ngo.js")
const { authenticateToken , forHome} = require("../middleware.js");

const donationController = require("../controllers/donation.controller.js")

router.get("/", authenticateToken , donationController.showListing);

router.get("/:ngoId", authenticateToken , donationController.showNgo);

router.get("/:ngoId/food_details", authenticateToken , donationController.foodForm);

router.post("/:ngoId/food_details", authenticateToken , donationController.foodCreated);

// router.post("/", authenticateToken , donationController.foodCreated);

// router.get("/showNgo", authenticateToken , donationController.showNgo);

router.get("/:ngoId/food_details/donation_confirm", authenticateToken ,  donationController.confirmationForm);

router.post("/showNgo/:ngoId/ngo_dashboard", authenticateToken ,donationController.confirmed);

module.exports = router;