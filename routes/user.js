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
    const { firstname, lastname ,date_birth, gender , address , state , city , zip_code , phone, email, password, role} =req.body;
    const checkIfUserExist = await userModel.findOne({ email });
    if (!isEmptyObject(checkIfUserExist)) {
      throw new Error("User already exist!");
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new userModel({
      firstname: firstname,
      lastname: lastname,
      role:req.body.role,
      date_birth:date_birth,
      gender: gender,
      address: address,
      state: state,
      city: city,
      zip_code: zip_code,
      phone: phone,
      email: email,
      password: hashedPassword,
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

  router.get("/statistics", async (req, res, next) => {
    try {
      const countHommes = await userModel.countDocuments({ gender: 'h' });
      const countFemmes = await userModel.countDocuments({ gender: 'f' });
      res.json({"Nombre de femmes inscrites" : countFemmes,"Nombre d'hommes inscrits ": countHommes});
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error);
      res.json({'Erreur lors du calcul des statistiques': error});

    }
  });
    router.get("/usersBetweenDates",validateToken, async (req, res) => {
      try {
        console.log(req.body);
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(req.body.endDate);
      console.log(startDate,endDate);
        const users = await userModel.find({
          date_birth: {
            $gte: startDate,
            $lte: endDate,
          },
        });
    
        res.json(users);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    
    router.get("/searchUsers", validateToken, async (req, res, next) => {
      try {
        const searchedValue = req.body.searchTerm;
    
        const query = {
          $or: [
            { firstname: { $regex: new RegExp(searchedValue, "i") } },
            { lastname: { $regex: new RegExp(searchedValue, "i") } },
            { email: { $regex: new RegExp(searchedValue, "i") } },
          ],
        };
    
        const users = await userModel.find(query);
        console.log(searchedValue);
        res.json(users);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

  

module.exports = router;
