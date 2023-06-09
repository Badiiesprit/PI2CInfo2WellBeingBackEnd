var express = require("express");
var router = express.Router();
const categoryModel = require("../models/category");
const validateToken = require("../middlewares/validateToken");
const validate = require("../middlewares/validateCategory");
const uploadAndSaveImage = require("../middlewares/uploadAndSaveImage");

/* GET home page. */
router.post("/", function (req, res, next) {
  res.send(req.body);
});

router.post("/add",validate,uploadAndSaveImage, async (req, res, next) => {
  try {
    const { title, description, parent } = req.body;
    const categoryData = {
      title,
      description,
    };
    if (parent) {
      categoryData.parent = parent;
    }
    if (req.body.imageIds) {
      categoryData.image = req.body.imageIds[0];
    }
    const category = new categoryModel(categoryData);
    const savedCategory = await category.save();
    res.json({ result: savedCategory });
  } catch (error) {
    res.json({ error: error.message });
  }
});

router.post("/update/:id", validateToken, validate,uploadAndSaveImage, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, parent } = req.body;
    const categoryData = {
      title,
      description,
    };
    if (parent) {
      categoryData.parent = parent;
    }
    if (req.body.imageIds) {
      categoryData.image = req.body.imageIds[0];
    }
    
    var category = await categoryModel.findById(id);
    if (category.title != title) {
      const checkIfCategoryExist = await categoryModel.find({ title });
      if (!isEmptyObject(checkIfCategoryExist)) {
        throw new Error("Category already exist!");
      }
    }
    if (req.body.imageIds) {
      categoryData.image = req.body.imageIds[0];
    }
    category = await categoryModel.findByIdAndUpdate(id, req.body);
    res.json({ result: category });
  } catch (error) {
    res.json({ error: error.message });
  }
});

router.delete("/delete/:id", validateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(id, {
      disable: true,
    });
    res.json({ result: category });
  } catch (error) {
    res.json({ error: error.message });
  }
});

router.get("/get/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findById(id);
    res.json({ result: category });
  } catch (error) {
    res.json({ error: error.message });
  }
});

router.get("/get", async (req, res, next) => {
  try {
    const categorys = await categoryModel.find();
    res.json({ size: categorys.length, result: categorys });
  } catch (error) {
    res.json({ error: error.message });
  }
});

router.get("/search", async (req, res, next) => {
  try {
    const { search } = req.body;
    if (!search) {
      categorys = await categoryModel.find();
    } else {
      categorys = await categoryModel.find({ title: { $regex: search } });
    }
    res.json({ size: categorys.length, result: categorys });
  } catch (error) {
    res.json({ error: error.message });
  }
});

module.exports = router;
