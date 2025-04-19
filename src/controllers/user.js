const express = require("express");
const router = express.Router();
const Donar = require("../models/donar.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Ngo = require("../models/ngo.js")
const FoodDetails = require("../models/food_details.js")
const { authenticateToken, forHome } = require("../middleware.js");
const Requests = require("../models/request.js");
const Pubnub = require("pubnub");


module.exports.getLogin = (req, res) => {
    res.render("login.ejs");
}

module.exports.postLogin =  async (req, res) => {
    const { usertype , email, password } = req.body;
    console.log(`whichUser : ${usertype}`);

    if(usertype === "Donar")
    {
        const Isuser = Donar.findOne({ email: email })
        .then((Isuser) => {
            // console.log(Isuser);
            if (!Isuser) return res.status(400).json({ error: "User not found" });
            bcrypt.compare(password, Isuser.password, function (err, result) {
                if (result) {
                    const token = jwt.sign({ id: Isuser.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
                    res.cookie("uid", token , {
                        httpOnly:true,
                    });
                    // res.header("Authorization", `Bearer ${token}`);
                    res.locals.currUser = Isuser.id;
                    console.log(Isuser)
                    console.log("In login post route ",res.locals.currUser);
                    console.log(`in post : ${Isuser.id}`)
                    res.render(`home.ejs`); 
                    // res.redirect(`/`);
                }
                else
                {
                    res.render("login.ejs");
                }
            });
        }).catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
        });
    } 

    if(usertype !== "Donar")
    {
        console.log("Inside NGO flow");
        const Isuser = Ngo.findOne({ email: email })
        .then((Isuser) => {
            if (!Isuser) return res.status(400).json({ error: "User not found" });
            console.log(password)
            console.log(Isuser.password)
            bcrypt.compare(password, Isuser.password, function (err, result) {
                if (result) {
                    const token = jwt.sign({ id: Isuser.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
                    res.cookie("uid", token , {
                        httpOnly:true,
                    });
                    // res.header("Authorization", `Bearer ${token}`);
                    res.redirect("/ngo_dashboard");
                }
                else
                {
                    res.render("login.ejs");
                }
            });
        }).catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
        });
    }

}

module.exports.donarSignup = async (req, res) => {
    const { name, email, contact, password, address, city, state , usertype } = req.body;
    // User Registration (Signup)

    try {
        // Check if user already exists
        const existingUser = await Donar.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "User already exists" });

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Save user to DB
        const newDonar = new Donar({ name, contact, address, city, state, email, password: hashedPassword });
        await newDonar.save();

        // Generate JWT Token
        const token = jwt.sign({ id: newDonar._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

            res.status(201).render("login.ejs");
        
    } catch (error) {
        console.log(error);
    }
}

module.exports.ngoSignup = async (req, res) => {
    const { name, email, contact, password, focus_area , city, state , website , registration_year} = req.body ;
    // User Registration (Signup)

    try {
        // Check if user already exists
        const existingNgo = await Ngo.findOne({ email });
        if (existingNgo) return res.status(400).json({ error: "Ngo already exists" });

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Save user to DB
        const newNgo = new Ngo({ name, contact, city, state, email, password: hashedPassword , website , registration_year , focus_area});
        await newNgo.save();

        // Generate JWT Token
        // const token = jwt.sign({ id: newNgo._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

            // res.status(201).render("ngo_dashboard.ejs");
            res.status(201).redirect("login");


    } catch (error) {
        console.log(error);
    }
}