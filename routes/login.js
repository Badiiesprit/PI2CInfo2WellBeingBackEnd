var express = require("express");
const userModel = require("../models/user");
const jwt = require('jsonwebtoken');
var router = express.Router();
const bcrypt = require('bcrypt');

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
          expiresIn: '99999999h', 
          expiresIn: '999999h', 
           main
        };
        const token = jwt.sign(payload, secretKey, options);
        const tokens = user.tokens;
        tokens.push(token);
        await userModel.findByIdAndUpdate(user._id,{tokens});
        return res.json({ token });
      } else {
        return res.status(401).json({ error: "mot de passe invalide" });
      }
    } catch (error) {
      return res.status(500).json({ error: "erreur lors de la connexion" });
    }
  });

module.exports=router;