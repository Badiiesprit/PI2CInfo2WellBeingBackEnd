const mongoose = require("mongoose");
const { boolean } = require("yup");
const centerSchema = new mongoose.Schema ({
    
    title:String,
    description:String,
    image:String,
    disable:Boolean,
    type:String,
    longitude:String,
    altitude:String,
    location:String,
    phone:Number,
    email:String,
    category:Array,


},{
    timestamps: true
});
const center = mongoose.model("center", centerSchema);
module.exports = center;