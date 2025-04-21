const mongoose = require("mongoose")
const { Schema } = mongoose.Schema;

const foodSchema = new mongoose.Schema({
    name: {
        type:String,
    },
    quantity:
    {
        type:String,
    },
    unit:
    {
        type:String,
    },
    city:
    {
        type:String,
    },
    state:
    {
        type:String,
    },
    donatedby:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Donar",
    },
    donatedTo:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Ngo",
    },   
},
{
    timestamps : true
}
)

const FoodDetails = mongoose.model("FoodDetails",foodSchema);

module.exports = FoodDetails;