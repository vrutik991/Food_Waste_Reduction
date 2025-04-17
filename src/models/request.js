const mongoose = require("mongoose")
const { Schema } = mongoose.Schema;

const requestSchema = new mongoose.Schema({
    name: String,
    message: String,
    location: String,
    requestedby:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Donar",
    },
    requestedto:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Ngo",
    }
},
{
    timestamps : true
}
)

const Requests = mongoose.model("Requests",requestSchema);

module.exports = Requests;