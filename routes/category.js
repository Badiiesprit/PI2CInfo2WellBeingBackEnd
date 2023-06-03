var express = require('express');
const categoryModel = require("../models/category");
const validateToken = require("../middlewares/validateToken");
const validate = require("../middlewares/validateCategory");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json("welcome to category");
});

router.post("/add",validateToken,validate,async (req, res, next) => {
    try {
      const {title} = req.body;
      const checkIfCategoryExist = await categoryModel.findOne({ title });
      if (checkIfCategoryExist) {
        throw new Error("Category already exist!");
      }
      const category = new categoryModel(req.body);
      category.save();
      res.json({result : category});
    } catch (error) {
      res.json({error : error.message});
    }
  }
);

router.delete("/delete/:id",validateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(id, {disable:true});
    res.json({result : category});
  } catch (error) {
    res.json({error : error.message});
  }
});

router.get("/get/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findById(id);
    res.json({result : category});
  } catch (error) {
    res.json({error : error.message});
  }
});

router.post("/update/:id",validateToken,validate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    var category = await categoryModel.findById(id);
    if(category.title!=title){
      const checkIfCategoryExist = await categoryModel.find({ title });
      if (!isEmptyObject(checkIfCategoryExist)) {
        throw new Error("Category already exist!");
      }
    }
    category = await categoryModel.findByIdAndUpdate(id, req.body);
    res.json({result : category});
  } catch (error) {
    res.json({error : error.message});
  }
});
router.get("/get", async (req, res, next) => {
  try {
    const categorys = await categoryModel.find();
    res.json({result : categorys});
  } catch (error) {
    res.json({error : error.message});
  }
});

module.exports = router;

