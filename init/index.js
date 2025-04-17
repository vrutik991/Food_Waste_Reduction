const MONGO_URI="mongodb://localhost:27017/food_waste_reduction"

const mongoose = require("mongoose");
const Ngo = require("../src/models/ngo");
const Ngodata = require("./data.js");
const foodData = require("./food_name.js");
const food = require("../src/models/food_name.js")


main().then(()=>
    {
        console.log("connected to database");
    }).catch(err=>
    {   
        console.log(MONGO_URI);
        console.error("err");
    })


async function main()
{
    await mongoose.connect(MONGO_URI);
}

function initDB(){
    Ngo.deleteMany({});
    Ngo.insertMany(Ngodata.data);
    food.deleteMany({});
    food.insertMany(foodData.foodName);
}
initDB();