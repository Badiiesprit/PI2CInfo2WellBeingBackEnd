
var express = require("express");
const userModel = require("../models/user");
const jwt = require('jsonwebtoken');
var router = express.Router();
const bcrypt = require('bcrypt');
<<<<<<< HEAD

router.post("/", async (req, res, next) => {
    const { password, email } = req.body;
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "l'email n'existe pas!" });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const payload = {
          userId: user._id,
          role: user.role, 
        };
        const options = {
          expiresIn: '10h', 
        };
        const token = jwt.sign(payload, secretKey, options);
        return res.json({ token });
      } else {
        return res.status(401).json({ error: "mot de passe invalide" });
      }
=======
/**
 * @swagger
 * /login:
 *   post:
 *   description: Register a user with email, password, and profile image
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               image:
 *                 description: Profile image of the user
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Success
 */
router.post("/", async (req, res, next)=>{
    const { password , email } =req.body;
    console.log(email);
    console.log(password);
    try {
        const user = await userModel.findOne({ email });
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            const payload = {
                userId: user._id, // Include any necessary user data in the payload
            };
            const options = {
                expiresIn: '99999999h', // Set the expiration time of the token
            };
            const token = jwt.sign(payload, secretKey, options);
            res.json({token:token});
        } else {
            
            res.json("Invalid Password");
        }
>>>>>>> badii
    } catch (error) {
      return res.status(500).json({ error: "erreur lors de la connexion" });
    }
  });

module.exports=router;
