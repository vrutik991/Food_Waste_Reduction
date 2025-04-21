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
const Pubnub = require("pubnub");

const MONGO_URI = "mongodb://localhost:27017/food_waste_reduction";
const userRouter = require("./routes/user");
const donationRouter = require("./routes/donation.routes.js");

const sessionOptions = {
    secret: "savefood@2",
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

async function main()
{
    await mongoose.connect(MONGO_URI);
}

app.use(express.static(path.join(__dirname,"/public")));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

 app.use(session(sessionOptions))

app.use((req,res,next)=>
{
    res.locals.currUser = req.user;
    console.log("in currUser middleware",res.locals.currUser);
    JSON.stringify(req.user);
    next();
})

app.get("/index",(req,res)=>
{
    res.render("index.ejs");
})

app.use("/",userRouter);
app.use("/showNgo",donationRouter);


var pubnub = new Pubnub({
    publishKey: "pub-c-8a75198e-e9b5-4595-9707-7bee8da7c913",
    subscribeKey: "sub-c-c1f806e6-b3b7-4a4c-8f76-7d9a54d67477",
    userId: 'myUniqueUserId'
})


app.get("/ngo_dashboard",authenticateToken,async (req, res) => {
    const ngoId = JSON.stringify(req.user.id).slice(1,-1);
    console.log(`ngo get: ${ngoId}`)
    // const myNgo_data = Ngo.findOne({myNgo})
    // console.log(myNgo_data)
    
    // pubnub.subscribe({
    //     channels: ["donate"],
    // })

    // pubnub.addListener({
    //     message:function(m)
    //     {
    //         console.log(`notificaiton: ${JSON.stringify(m.message.title)}`);
    //     }
    // })
    const foodDetails = await FoodDetails.find({donatedTo:ngoId})
    console.log(`foodDetails: *** ${foodDetails}`)
    res.render("ngo_dashboard.ejs" , {ngoId , foodDetails});
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