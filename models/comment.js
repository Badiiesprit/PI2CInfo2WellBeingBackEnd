const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
    
    comment: String,
    like:Number,
    dislike:Number,
    post:String,
    disable:Boolean,

},{
    timestamps: true
});
const comment = mongoose.model("post", commentSchema);
module.exports = comment;