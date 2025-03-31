const mongoose = require("mongoose")
const { Schema } = mongoose.Schema;

const ngoSchema = new mongoose.Schema({
    name: String,
    city: String, 
    state: String,
    email: String,
    contact: Number,
    website:String,
    pincode:Number,
    registration_year:Number,
    password:String,
})

const Ngo = mongoose.model("Ngo",ngoSchema);

module.exports = Ngo;