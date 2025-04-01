const mongoose = require("mongoose");
const { Schema } = mongoose.Schema;

const donarSchema = new mongoose.Schema({
    name: String,
    email: String,
    contact: Number,
    address: String,
    city: String,
    state: String,
    pincode: String,
    password: String,
    donated:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"FoodDetails",
            default:[]
        }
    ]
})

const Donar = mongoose.model("Donar",donarSchema);

module.exports = Donar;