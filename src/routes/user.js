const express = require("express");
const router = express.Router();
const Donar = require("../models/donar");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Ngo = require("../models/ngo")
const { authenticateToken , forHome} = require("../middleware.js");

router.get("/login", (req, res) => {
    res.render("login.ejs");
})

router.post("/login", async (req, res) => {
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
                    console.log(`in post : ${Isuser.id}`)
                    res.redirect(`/home`); 
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

})

router.post("/donar_signup", async (req, res) => {
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
});

router.post("/ngo_signup", async (req, res) => {
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
});

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

module.exports = router