const mongoose = require("mongoose");
const { boolean } = require("yup");
const offerSchema = new mongoose.Schema({
    
    title: String,
    description: String,
    image:String,
    disable:Boolean,
    center:String,

},{
    timestamps: true
});
const offer = mongoose.model("offer", offerSchema);
module.exports = offer;