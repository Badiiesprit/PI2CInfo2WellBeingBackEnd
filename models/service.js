const mongoose = require("mongoose");
const { boolean } = require("yup");
const serviceSchema = new mongoose.Schema({
    
    name: String,
    description: String,
    image:String,
    phone:Number,
    email:String,
    location:String,
    disable:Boolean,

},{
    timestamps: true
});
const service = mongoose.model("service", serviceSchema);
module.exports = service;