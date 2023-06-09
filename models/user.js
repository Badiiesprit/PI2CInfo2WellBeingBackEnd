const mongoose = require("mongoose");
const { token } = require("morgan");
const { array } = require("yup");
const userSchema = new mongoose.Schema({
    
    firstname:{
        type:String,
        required:true,
        trim:true
    },
    lastname:{
        type:String,
        required:true,
        trim:true
    },
    phone:{
        type:String,
        required:false,
        trim:true
    },  
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:false,
        trim:true
    },

    user_image:{
        type : mongoose.Types.ObjectId, 
        ref :"image"
    },
    role: {
        type: [String],
        trim: true
      },
    disable:{
        type: Boolean,
        default:false
    },
    tokens:{
        type: [String],
        trim: true
        
    }
},{
    timestamps: true
});



const user = mongoose.model("user", userSchema);
module.exports = user;