const mongoose = require("mongoose");
const { boolean } = require("yup");
const centerSchema = new mongoose.Schema ({
    
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    image:[{type : mongoose.Types.ObjectId, ref :"image"}],
    longitude:{
        type:String,
        required:true,
        trim:true
    },
    altitude:{
        type:String,
        required:true,
        trim:true
    },
    location:{
        type:String,
        required:true,
        trim:true
    },
    phone:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    category:[{type : mongoose.Types.ObjectId, ref :"category"}],
    disable:{
        type:Boolean,
        default:false
    }
},{
    timestamps: true
});
const center = mongoose.model("center", centerSchema);
module.exports = center;