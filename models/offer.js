const mongoose = require("mongoose");
const { boolean } = require("yup");
const offerSchema = new mongoose.Schema({
    
    name: String,
    description: String,
    image:String,
    disable:Boolean,
    center:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'center'
    }

},{
    timestamps: true
});
const offer = mongoose.model("offer", offerSchema);
module.exports = offer;