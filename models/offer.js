const mongoose = require("mongoose");
const { boolean } = require("yup");
const offerSchema = new mongoose.Schema({
    
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    center:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'center'
    },
    image:{
        type : mongoose.Types.ObjectId, 
        ref :"image"
    },
    disable:{
        type:Boolean,
        default:false
    }

},{
    timestamps: true
});
const offer = mongoose.model("offer", offerSchema);
module.exports = offer;