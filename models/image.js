const mongoose = require("mongoose");
const { boolean } = require("yup");
const imageSchema = new mongoose.Schema ({
    
    path:String,

},{
    timestamps: true
});
const image = mongoose.model("image", imageSchema);
module.exports = image;