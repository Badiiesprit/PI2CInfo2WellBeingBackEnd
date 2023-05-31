const mongoose = require("mongoose");
const professeurSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    telephone: Number
},{
    timestamps: true
});
const professeur = mongoose.model("professeur", professeurSchema);
module.exports = professeur;