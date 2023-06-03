const mongoose = require("mongoose");
const { array } = require("yup");
const userSchema = new mongoose.Schema({
    
    firstname: String,
    lastname: String,
    phone: String,
    email:String,
    password:String,
    user_image:String,
    role:Array,
    disable:Boolean,

},{
    timestamps: true
});



const user = mongoose.model("user", userSchema);
module.exports = user;