const mongoose = require("mongoose");
const { Schema } = mongoose;

const foodNameSchema = new Schema({
    name: String,
    keywords:{
        type:[String]
    },
})

const foodName = mongoose.model("foodName",foodNameSchema);

module.exports = foodName;