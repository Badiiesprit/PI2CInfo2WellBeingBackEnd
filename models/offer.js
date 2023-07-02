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
    },
    clickCount: {
        type: Number,
        default: 0,
    },
    ratedBy: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
          rating: {
            type: Number,
            required: true,
          },
        },
      ],
    averageRating:{
        type: Number,
        default: 0,
    }

},{
    timestamps: true
});
const offer = mongoose.model("offer", offerSchema);
module.exports = offer;