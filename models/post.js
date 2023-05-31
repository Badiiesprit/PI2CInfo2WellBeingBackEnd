const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
    
    title: String,
    short_description:String,
    description: String,
    image:String,
    

},{
    timestamps: true
});
const post = mongoose.model("post", postSchema);
module.exports = post;