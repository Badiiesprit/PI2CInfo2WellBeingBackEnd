const mongoose = require("mongoose");
const { boolean } = require("yup");
const serviceSchema = new mongoose.Schema({
    
    title: String,
    description: String,
    image:String,
    disable:Boolean,
    type:String,
    location:String,

},{
    timestamps: true
});
const service = mongoose.model("service", serviceSchema);
module.exports = service;