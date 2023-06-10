const mongoose = require("mongoose");
const { boolean } = require("yup");
const serviceSchema = new mongoose.Schema({
    
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
    date:{
        type:Date,
        trim:true
    },
    image:{
        type : mongoose.Types.ObjectId, 
        ref :"image"
    },
    phone:{
        type:String,
        trim:true
    },    
    email:{
        type:String,
        trim:true
    },
    location:{
        type:String,
        trim:true
    },

    disable:{
        type:Boolean,
        default:false
    },
    qrCode: {
        type: String,
    },
    clickStatistics: [
        {
          date: {
            type: Date,
            required: true
          },
          count: {
            type: Number,
            default: 0
          },
          clickedDates: [
            {
              type: Date
            }
          ]
        }
      ]
   


},{
    timestamps: true
});
const service = mongoose.model("service", serviceSchema);
module.exports = service;