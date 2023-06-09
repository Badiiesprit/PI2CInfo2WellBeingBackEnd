var express = require("express");
var router = express.Router();
const userModel = require("../models/user");


router.post('/logout', async(req, res) => {
 
  
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const [token] = authHeader.split(' ');
    const decoded = jwt.verify(token, secretKey); 
    const userId = decoded.userId;
    const user = await userModel.findById(userId);
    const tokens = user.tokens.filter((element) => element !== token);
    await userModel.findByIdAndUpdate(user._id,{tokens});
    res.json({ message: 'Déconnexion réussie' });
  }

});
  module.exports = router;
