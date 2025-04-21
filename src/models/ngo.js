const mongoose = require("mongoose")
const { Schema } = mongoose.Schema;

const ngoSchema = new mongoose.Schema({
    name: String,
    city: String, 
    state: String,
    area:String,
    email: String,
    contact: String,
    website:String,
    pincode:Number,
    password:String,
})

const Ngo = mongoose.model("Ngo",ngoSchema);

module.exports = Ngo;