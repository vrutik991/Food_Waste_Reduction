require("dotenv").config();

const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const Ngo = require("./models/ngo")
const FoodDetails = require("./models/food_details");
const mongoose = require('mongoose');
const sendNotificationEmail = require("./mailer");
const session = require("express-session");
const Donar = require("./models/donar");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { homedir } = require("os");
const { authenticateToken , forHome} = require("./middleware.js");
const cookieParser=require("cookie-parser");
const { log } = require("console");
const Requests = require("./models/request.js");

const MONGO_URI = "mongodb://localhost:27017/food_waste_reduction";

const sessionOptions = {
    secret: "savefood@1",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // cannot be used single
        maxAge: 7 * 24 * 60 * 60 * 1000, // can be used single
        httpOnly: true, // to stop cross scripting attacks
    }
}

main().then(() => {
    console.log("connected to database");
}).catch(err => {
    console.log(MONGO_URI);
    console.error("err");
})


async function main() {
    await mongoose.connect(MONGO_URI);
}
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate)
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use(session(sessionOptions))

app.use((req,res,next)=>
{
    JSON.stringify(req.user);
    next();
})

app.get("/",authenticateToken,async (req, res) => {
    // const currUser = await Donar.findById({userId})
    console.log("/Home Page");
    res.render("home.ejs");
})

app.get("/home/:userid",authenticateToken, async (req, res) => {
    const userId = req.params.userid;
    const currUser = await Donar.findById(userId)
    console.log("/Home Page");
    res.render("home.ejs" , {currUser : currUser});
})

app.post("/donar_signup", async (req, res) => {
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

app.post("/ngo_signup", async (req, res) => {
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

app.get("/login", (req, res) => {
    res.render("login.ejs");
})

app.post("/login", async (req, res) => {
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
                    res.redirect(`/home/${Isuser.id}`); 
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

app.get("/donar_signup", (req, res) => {
    res.render("donar_signup.ejs");
})

app.get("/ngo_signup",(req,res) =>
{
    res.render("ngo_signup.ejs");
})

app.get("/logout",authenticateToken,(req,res)=>
{   
    res.clearCookie("uid");
    // console.log(`logout request: ${JSON.stringify(req.user.id)}`)
    // console.log(FoodDetails.findById(req.user.id.name));
    res.redirect("/");
    // window.location.reload();
    
})

app.get("/:userid/food_details", authenticateToken, (req, res) => {
    const userId = req.params.userid;

    res.render("food_details.ejs",{userId});
})

app.post("/:userid/food_details",authenticateToken, async (req, res) => {
    const { food_name, food_quantity, unit } = req.body;
    const userId = req.params.userid;
    const newFood = new FoodDetails({
        name: food_name,
        quantity: food_quantity,
        unit: unit,
        donatedby: req.user.id
    });
    await newFood.save();

    const user_data = await Donar.findById(userId);
    console.log(user_data);
    console.log(newFood.id);
    user_data.donated.push(newFood.id);
    console.log(user_data.donated);
    // res.send("Done");
    await user_data.save();
    // const newFoodDetail = 
    res.redirect(`/${userId}/food_details/${user_data._id}`)
})

app.get("/:userId/food_details/:foodId",async(req,res)=>
{
    const foodId  = req.params.foodId;
    const userId  = req.params.userId;
    console.log(foodId,userId)
    const ngo_listing = await Ngo.find({})
    res.render("ngo_listing.ejs", { ngo_listing , userId , foodId });

})

app.get("/ngo_dashboard",authenticateToken, (req, res) => {
    const myNgo = JSON.stringify(req.user.id)
    const myNgo_data = Ngo.findOne({myNgo})
    console.log(myNgo_data)
    
    res.render("ngo_dashboard.ejs");
})

app.get("/:userId/food_details/:foodId/donation_confirm/:ngoId", async (req,res) =>
{   
    const  foodId  = req.params.foodId;
    const  userId  = req.params.userId;
    const  ngoId  = req.params.ngoId;
    console.log(ngoId);
    const selected_ngo = await Ngo.findById({_id : ngoId});
    console.log(selected_ngo)
    console.log(userId);
    const food_data = await Donar.findById({_id : userId}).populate("donated")
    console.log(`Food Data : ${food_data}`);
    res.render("donation_confirm.ejs", {selected_ngo : selected_ngo , food_data , ngoId});
})


// API route to send email notification
app.get("/send-notification", async (req, res) => {
    // const { ngoEmail, foodDetails, personDetails } = req.body;
    const ngoEmail = "savefoodforgood@gmail.com";
    // const DonatedTo = new FoodDetails({
    //     donatedTo : 
    // })

    // if (!ngoEmail || !foodDetails || !personDetails) {
    //     return res.status(400).json({ error: "Missing required data" });
    // }
  
    try {
        await sendNotificationEmail(ngoEmail);
        res.status(200).json({ message: "Notification sent successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to send notification" });
    }
});

app.post("/ngo_dashboard/:ngoId",(req,res) =>
{
    const message = req.body;
    console.log(message);
    const request = new Requests({
        
    })
    res.redirect("/");
})

app.get("/ngo_home", (req, res) => {
    res.render("ngo.ejs");
})

app.post("/ngo_home", (req, res) => {

})

// app.get('/auth-status', (req, res) => {
//     const token = req.cookies.token;
//     if (!token) {
//         return res.json({ isAuthenticated: false });
//     }

//     jwt.verify(token, SECRET_KEY, (err, user) => {
//         if (err) {
//             return res.json({ isAuthenticated: false });
//         }
//         res.json({ isAuthenticated: true, user });
//     });
// });


app.listen(4000, () => {
    console.log("Listening to 4000");
})