const MONGO_URI="mongodb://localhost:27017/food_waste_reduction"

const mongoose = require("mongoose");
const Ngo = require("../models/ngo");
const Ngodata = require("./data.js") 


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
}
initDB();