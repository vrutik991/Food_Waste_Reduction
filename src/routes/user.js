const express = require("express");
const router = express.Router();
const Donar = require("../models/donar");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Ngo = require("../models/ngo")
const { authenticateToken , forHome} = require("../middleware.js");
const { login, postLogin } = require("../controllers/user.js");
const userController = require("../controllers/user.js")

router.get("/login", userController.getLogin);

router.post("/login",userController.postLogin)

router.post("/donar_signup", userController.donarSignup);

router.post("/ngo_signup", userController.ngoSignup);

router.get("/donar_signup", (req, res) => {
    res.render("donar_signup.ejs");
})

router.get("/ngo_signup",(req,res) =>
{
    res.render("ngo_signup.ejs");
})

router.get("/logout",(req,res)=>
{   
    res.clearCookie("uid");
    // console.log(`logout request: ${JSON.stringify(req.user.id)}`)
    // console.log(FoodDetails.findById(req.user.id.name));
    res.redirect("/home");
    // window.location.reload();
    
})

router.get("/home",async (req, res) => {
    // const currUser = await Donar.findById({userId})
    console.log("/Home Page");
    res.render("home.ejs");
})

router.get("/home/:userid",authenticateToken, async (req, res) => {
    const userId = req.params.userid;
    const currUser = await Donar.findById(userId)
    console.log("/Home Page");
    res.render("home.ejs" , {currUser : currUser});
})

router.get("/aboutus",async (req, res) => {
    // const currUser = await Donar.findById({userId})
    console.log("/aboutus");
    res.render("aboutus.ejs");
})

module.exports = router;
