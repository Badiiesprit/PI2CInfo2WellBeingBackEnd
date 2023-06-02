var express = require("express");
const userModel = require("../models/user");
const validateUser = require("../middlewares/validateUser");
const jwt = require('jsonwebtoken');
var router = express.Router();
const bcrypt = require('bcrypt');

router.get("/", function (req, res, next) {
  res.json("welcome to TuniVita");
});
router.post("/:email/:password",async (req, res, next) => {
    const { email, password } =req.params;

    try {
        const user = await userModel.findOne({ email });
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            const payload = {
                userId: user._id, // Include any necessary user data in the payload
            };
            const secretKey = 'kgnùfdjhnojgnfsjlnfmljkdfsgb66g5fg5fg5fgfgkdg6fg5fg'; // Replace with your own secret key
            const options = {
                expiresIn: '24h', // Set the expiration time of the token
            };
            const token = jwt.sign(payload, secretKey, options);
            res.json({token:token});
        } else {
            
            res.json("Invalid Password");
        }
    } catch (error) {
        res.json("email does not exist!");
    }
  });


module.exports=router;
