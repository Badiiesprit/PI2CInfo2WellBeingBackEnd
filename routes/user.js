var express = require("express");
const userModel = require("../models/user");
const validateUser = require("../middlewares/validateUser");

var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json("welcome to category");
});

router.get("/get", async (req, res, next) => {
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

    const user = new userModel({
      firstname: firstname,
      lastname: lastname,
      phone: phone,
      email: email,
      password: password,
    });

    user.save();
    res.json("User Added");
  } catch (error) {
    res.json(error.message);
  }
});

router.delete("/delete/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      await userModel.findByIdAndUpdate(id, {disable:true});
      const user = await userModel.findById(id);
      res.json(user);
    } catch (error) {
      res.json(error.message);
    }
  });

  router.post("/update/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      const { email } = req.body;
      var user = await userModel.findById(id);
      if(user.email!=email){
        const checkIfUserExist = await userModel.find({ title });
        if (!isEmptyObject(checkIfUserExist)) {
          throw new Error("user already exist!");
        }
      }
      await userModel.findByIdAndUpdate(id, req.body);
      user = await userModel.findById(id);
      res.json(user);
    } catch (error) {
      res.json(error.message);
    }
  });


module.exports = router;
