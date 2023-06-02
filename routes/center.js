var express = require('express');
const centerModel = require("../models/center");
const categoryModel = require("../models/category");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json("welcome to center");
});

router.post(
  "/add",
  async (req, res, next) => {
    
    try {
      const {title , description , longitude , altitude , location , phone , email , category} = req.body;
      const checkIfCenterExist = await centerModel.findOne({ title });
      if (checkIfCenterExist) {
        throw new Error("Center already exist!");
      }
      if (!title) {
        throw new Error("Title is required!");
      }
      if (!description) {
        throw new Error("Description is required!");
      }

      if (!category) {
        throw new Error("Category is required!");
      }else{
        try {
          var category_center = await categoryModel.findById(category);
        } catch (error) {
          throw new Error("Category is not correct!");
        }
        if(empty(category_center)){
          throw new Error("Category is not correct!");
        }
      }
      const center = new centerModel({
        title,
        description,
        longitude , 
        altitude , 
        location , 
        phone , 
        email ,
        category
      });
      center.save();
      res.json(center);
    } catch (error) {
      res.json(error.message);
    }
  }
);

router.delete("/delete/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await centerModel.findByIdAndUpdate(id, {disable:true});
    const center = await centerModel.findById(id);
    res.json(center);
  } catch (error) {
    res.json(error.message);
  }
});

router.get("/get/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const center = await centerModel.findById(id);
    res.json(center);
  } catch (error) {
    res.json(error.message);
  }
});

router.post("/update/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title , category } = req.body;
    var center = await centerModel.findById(id);
    console.log(center);
    console.log(title);
    if(center.title!=title){
      const checkIfCenterExist = await centerModel.find({ title });
      console.log(empty(checkIfCenterExist));
      if (!empty(checkIfCenterExist)) {
        throw new Error("Center already exist!");
      }
    }
    if (!category) {
      throw new Error("Category is required!");
    }else{
      try {
        var category_center = await categoryModel.findById(category);
      } catch (error) {
        throw new Error("Category is not correct!");
      }
      if(empty(category_center)){
        throw new Error("Category is not correct!");
      }
    }
    await centerModel.findByIdAndUpdate(id, req.body);
    center = await centerModel.findById(id);
    res.json(center);
  } catch (error) {
    res.json(error.message);
  }
});
router.get("/get", async (req, res, next) => {
  try {
    const centers = await centerModel.find();
    res.json(centers);
  } catch (error) {
    res.json(error.message);
  }
});

module.exports = router;

function empty(value) {
  if (typeof value === 'undefined' || value === null) {
    return true;
  }

  if (typeof value === 'string' && value.trim() === '') {
    return true;
  }

  if (Array.isArray(value) && value.length === 0) {
    return true;
  }

  if (typeof value === 'object' && Object.keys(value).length === 0) {
    return true;
  }

  return false;
}
