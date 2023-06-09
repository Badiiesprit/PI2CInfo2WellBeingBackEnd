var express = require('express');
const centerModel = require("../models/center");
const categoryModel = require("../models/category");
const validateToken = require("../middlewares/validateToken");
const validate = require("../middlewares/validateCenter");
const uploadAndSaveImage = require("../middlewares/uploadAndSaveImage");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json("welcome to center");
});

router.post("/add" , validate , uploadAndSaveImage , async (req, res, next) => {
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
        if(isEmptyObject(category_center)){
          throw new Error("Category is not correct!");
        }
      }
      const categoryData = {
        title,
        description,
        longitude , 
        altitude , 
        location , 
        phone , 
        email ,
        category
      };
      if (req.body.imageIds) {
        categoryData.image = req.body.imageIds;
      }
      const center = new centerModel(categoryData);
      center.save();
      res.json(center);
    } catch (error) {
      res.json({error : error.message});
    }
  }
);

router.delete("/delete/:id",validateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    await centerModel.findByIdAndUpdate(id, {disable:true});
    const center = await centerModel.findById(id);
    res.json(center);
  } catch (error) {
    res.json({error : error.message});
  }
});

router.get("/get/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const center = await centerModel.findById(id);
    res.json(center);
  } catch (error) {
    res.json({error : error.message});
  }
});

router.post("/update/:id",validateToken,validate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title , category } = req.body;
    var center = await centerModel.findById(id);
    console.log(center);
    console.log(title);
    if(center.title!=title){
      const checkIfCenterExist = await centerModel.find({ title });
      console.log(isEmptyObject(checkIfCenterExist));
      if (!isEmptyObject(checkIfCenterExist)) {
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
      if(isEmptyObject(category_center)){
        throw new Error("Category is not correct!");
      }
    }
    await centerModel.findByIdAndUpdate(id, req.body);
    center = await centerModel.findById(id);
    res.json(center);
  } catch (error) {
    res.json({error : error.message});
  }
});
router.get("/get", async (req, res, next) => {
  try {
    const centers = await centerModel.find();
    res.json(centers);
  } catch (error) {
    res.json({error : error.message});
  }
});
router.get("/search", async (req, res, next) => {
  try {
    const { search } = req.body;
    if (!search) {
      centers = await centerModel.find();
    } else {
      centers = await centerModel.find({ title:{$regex:search} });
    }
    res.json({result : centers});
  } catch (error) {
    res.json({error : error.message});
  }
});

module.exports = router;

