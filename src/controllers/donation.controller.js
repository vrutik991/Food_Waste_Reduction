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

var pubnub = new Pubnub({
    publishKey: "pub-c-8a75198e-e9b5-4595-9707-7bee8da7c913",
    subscribeKey: "sub-c-c1f806e6-b3b7-4a4c-8f76-7d9a54d67477",
    userId: 'myUniqueUserId'
})

module.exports.foodForm = (req, res) => {
    const ngoId = req.params.ngoId;
    const userId = req.params.userid;
    res.render("food_details.ejs", { userId , ngoId });
}

module.exports.foodCreated = async (req, res) => {
    try {
        const { food_name, food_quantity, unit } = req.body;
        const ngoId = req.params.ngoId;
        const userId = req.user.id;
        const newFood = new FoodDetails({
            name: food_name,
            quantity: food_quantity,
            unit: unit,
            donatedby: req.user.id,
            donatedTo: ngoId,
        });

        await newFood.save();
        console.log(`before donated ${userId}`)
        const user_data = await Donar.findById(userId);
        console.log(user_data)
        user_data.donated.push(newFood.id);
        // res.send("Done");
        await user_data.save();
        // const newFoodDetail = 
        res.redirect(`/listing/${ngoId}/food_details/donation_confirm`)
        // res.redirect(`/${userId}/food_details/${user_data._id}`)
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error creating food' });
    }
}

module.exports.showListing = async (req, res) => {
    const foodId = req.params.foodId;
    const userId = req.params.userId;
    const ngo_listing = await Ngo.find({})
    res.render("ngo_listing.ejs", { ngo_listing, userId, foodId });

}

module.exports.showNgo = async (req, res) => {
    const ngoId = req.params.ngoId;
    const ngo_listing = await Ngo.findById(ngoId);
    res.render("showNgo.ejs", { ngo_listing });

}

module.exports.confirmationForm = async (req, res) => {
    // const foodId = req.params.foodId;
    // const userId = req.params.userId;
    const ngoId = req.params.ngoId;
    // console.log(ngoId);
    const selected_ngo = await Ngo.findById({ _id: ngoId });
    // console.log(selected_ngo)
    // console.log(userId);
    const food_data = await Donar.findById({ _id: req.user.id }).populate("donated")
    console.log(food_data.donated);
    const donated = food_data.donated;
    res.render("donation_confirm.ejs" , {selected_ngo , donated});
    // res.render("donation_confirm.ejs", { selected_ngo: selected_ngo, food_data, ngoId, userId, foodId });
}

module.exports.confirmed = async (req, res) => {
    const message = req.body;
    const city = req.body.city;
    const area = req.body.area;
    console.log("city and area" , city , area);
    const ngoId = req.params.ngoId;
    const userId = JSON.stringify(req.user.id).slice(1,-1);
    console.log(userId);
    const donar = await Donar.findById(userId);
    console.log(donar.email);
    console.log(`in confirmed ${userId}`);
    // const foodId = req.params.foodId;

    let publishPayload = {
        channel:`donate${ngoId}`,
        message: {
            title:"greeting",
            description:message,
            email:donar.email,
            city:donar.city,
        },
    }

    donar.donated=[];
    donar.save();
    
    pubnub.publish(publishPayload,function(status,response) {
        if(status.error)
        {
            console.log("Publish Failed",status);
        }
        else{
            console.log("Message Published:",response);
        }
    });

    console.log(`in last ${ngoId}`)

    console.log(message);
    const request = new Requests({
        name: donar.name,
        message: req.body.message,
        city: city,
        area:area,
        requestedby: userId,
        requestedto: ngoId
    })
    request.save();
    res.redirect("/home");
}