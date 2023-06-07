var express = require("express");
const userModel = require("../models/user");
const validateUser = require("../middlewares/validateUser");
const validateToken = require("../middlewares/validateToken");
const bcrypt = require('bcrypt');
const user = require("../models/user");

var router = express.Router();


router.get("/", function (req, res, next) {
  res.json("welcome to TuniVita");
});

router.get("/get", validateToken ,async (req, res, next) => {
  try {
      const users = await userModel.find();
      res.json(users);
  } catch (error) {
    res.json(error.message);
  }
});

router.post("/addUser",validateUser, async (req, res, next) => {
    
  try {
    const { firstname, lastname, phone, email, password} =req.body;
    const checkIfUserExist = await userModel.findOne({ email });
    if (!isEmptyObject(checkIfUserExist)) {
      throw new Error("User already exist!");
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new userModel({
      firstname: firstname,
      lastname: lastname,
      phone: phone,
      email: email,
      password: hashedPassword,
      role:req.body.role,
    });

    user.save();
    res.json("User Added");
  } catch (error) {
    res.json(error.message);
  }
});

router.delete("/delete/:id",validateToken, async (req, res, next) => {
    try {
      const { id } = req.params;
      await userModel.findByIdAndUpdate(id, {disable:true});
      const user = await userModel.findById(id);
      res.json(user);
    } catch (error) {
      res.json(error.message);
    }
  });

  router.post("/update/:id",validateToken, async (req, res, next) => {
    try {
      const { id } = req.params;
      const { email } = req.body;
      console.log(req.body);
      var user = await userModel.findById(id);
      if(user.email!=email){
        const checkIfUserExist = await userModel.find({ email });
        if (!isEmptyObject(checkIfUserExist)) {
          throw new Error("user already exist!");
        }
      }
      await userModel.findByIdAndUpdate(id, req.body);
      if (!(user.role.includes("admin"))) {
        await userModel.findByIdAndUpdate(id,{role:["user"]});
      }
      
      user = await userModel.findById(id);
      console.log(user);
      res.json(user);
    } catch (error) {
      res.json(error.message);
    }
  });

  

module.exports = router;
