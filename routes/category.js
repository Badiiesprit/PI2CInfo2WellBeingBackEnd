var express = require('express');
const categoryModel = require("../models/category");

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json("welcome to category");
});

router.post(
  "/add",
  async (req, res, next) => {
    
    try {
      const {title , description , parent} = req.body;
      const checkIfCategoryExist = await categoryModel.findOne({ title });
      if (checkIfCategoryExist) {
        throw new Error("Category already exist!");
      }
      if (!title) {
        throw new Error("Title is required!");
      }
      if (!description) {
        throw new Error("Description is required!");
      }
      if (!parent) {
        parent = 0;
      }
      const category = new categoryModel({
        title: title,
        description: description,
        parent: parent
      });
      category.save();
      res.json(category);
    } catch (error) {
      res.json(error.message);
    }
  }
);

router.delete("/delete/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await categoryModel.findByIdAndUpdate(id, {disable:true});
    const category = await categoryModel.findById(id);
    res.json(category);
  } catch (error) {
    res.json(error.message);
  }
});

router.get("/get/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findById(id);
    res.json(category);
  } catch (error) {
    res.json(error.message);
  }
});

router.post("/update/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    var category = await categoryModel.findById(id);
    console.log(category);
    console.log(title);
    if(category.title!=title){
      const checkIfCategoryExist = await categoryModel.find({ title });
      console.log(isEmptyObject(checkIfCategoryExist));
      if (!isEmptyObject(checkIfCategoryExist)) {
        throw new Error("Category already exist!");
      }
    }
    await categoryModel.findByIdAndUpdate(id, req.body);
    category = await categoryModel.findById(id);
    res.json(category);
  } catch (error) {
    res.json(error.message);
  }
});
router.get("/get", async (req, res, next) => {
  try {
    const categorys = await categoryModel.find();
    res.json(categorys);
  } catch (error) {
    res.json(error.message);
  }
});

module.exports = router;

