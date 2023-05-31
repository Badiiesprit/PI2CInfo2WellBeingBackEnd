const mongoose = require("mongoose");
const { boolean } = require("yup");
const categorySchema = new mongoose.Schema ({
    
    title:String,
    description:String,
    image:String,
    disable:Boolean,
    parent:String,

},{
    timestamps: true
});
const category = mongoose.model("category", categorySchema);
module.exports = category;