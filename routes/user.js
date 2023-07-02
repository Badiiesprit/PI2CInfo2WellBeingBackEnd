var express = require("express");
const userModel = require("../models/user");
const validateUser = require("../middlewares/validateUser");
const validateToken = require("../middlewares/validateToken");
const bcrypt = require('bcrypt');
const user = require("../models/user");

var router = express.Router();



router.get("/",validateToken, function (req, res, next) {
  res.json("welcome to TuniVita");
});

router.get("/get", validateToken ,async (req, res, next) => {
  try {
      const users = await userModel.find();
      res.json(users);
      console.log("retuning data");
  } catch (error) {
    res.json(error.message);
  }
});

router.get("/get/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    // Get path of Images
    res.json({ result: user });
  } catch (error) {
    res.json({ error: error.message });
  }
});
router.put("/update/:id", validateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedUser = req.body;
    if(updatedUser.password == "")
    {
      delete updatedUser.password;
    }
    const user = await userModel.findByIdAndUpdate(id, updatedUser, { new: true });

    if (!user) {
      throw new Error("User not found");
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// router.post("/update/:id", validateToken, async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { email } = req.body;
//     console.log(req.body);
    
//     let user = await userModel.findById(id);
    
//     if (user.email != email) {
//       const checkIfUserExist = await userModel.find({ email });
//       if (!isEmptyObject(checkIfUserExist)) {
//         throw new Error("User already exists!");
//       }
//     }
    
//     await userModel.findByIdAndUpdate(id, req.body);
    
//     user = await userModel.findById(id); // Fetch the updated user again
    
//     if (!user.role.includes("admin")) {
//       await userModel.findByIdAndUpdate(id, { role: ["user"] });
//       user.role = ["user"]; // Update the role in the user object as well
//     }
    
//     console.log(user);
//     res.json(user);
//   } catch (error) {
//     res.json(error.message);
//   }
// });
// router.get("/get", validateToken, async (req, res, next) => {
//   try {
//     const role = req.user.role;
//     let users;
    
//     if (role === "admin") {
//       users = await userModel.find();
//     } else if (role === "user") {
//       users = await userModel.findById(req.user.id);
//     } else {
//       throw new Error("Invalid user role");
//     }

//     res.json(users);
//   } catch (error) {
//     res.json(error.message);
//   }
// });

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
      role:["user"],
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


  router.get("/enable-disable/:id", async (req, res) => {
    const userId = req.params.id;
    
    try {
      const user = await userModel.findById(userId);
      if (user) {
        user.disable = !user.disable;
        await user.save();
        res.json({ user:user.disable });
      } else {
        res.json({ error: "service not found" });
      }
    } catch (error) {
      res.json({ error: error.message });
    }
  });
  




  // router.put('/enable/:userId', (req, res) => {
  //   const userId = req.params.userId;
  
  //   User.findById(userId, (err, user) => {
  //     if (err) {
  //       console.error('Error finding user:', err);
  //       return res.status(500).json({ message: 'Error finding user' });
  //     }
  
  //     if (!user) {
  //       return res.status(404).json({ message: 'User not found' });
  //     }
  
  //     user.disabled = false; 
  
  //     user.save((err, updatedUser) => {
  //       if (err) {
  //         console.error('Error enabling user:', err);
  //         return res.status(500).json({ message: 'Error enabling user' });
  //       }
  
  //       return res.status(200).json({ message: 'User enabled successfully', user: updatedUser });
  //     });
  //   });
  // });

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

  router.get("/statistics",validateToken, async (req, res, next) => {
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
