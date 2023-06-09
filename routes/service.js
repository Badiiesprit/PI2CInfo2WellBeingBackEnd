const express = require("express");
const serviceModel = require("../models/service");
const validate = require("../middlewares/validateService");
const uploadAndSaveImage = require("../middlewares/uploadAndSaveImage");
const router = express.Router();
const validateToken = require("../middlewares/validateToken");


router.post("/add",validate,validateToken,uploadAndSaveImage, async (req, res, next) => {
  try {
    const { name, description, phone, email, location,date } = req.body;

    const checkIfOfferExist = await serviceModel.findOne({ name });
    if (checkIfOfferExist) {
      throw new Error("Service already exist!");
    }

    const serviceData ={
      name,
      description,
      location,
      phone,
      email,
      date,
    };

    if (req.body.imageIds) {
      serviceData.image = req.body.imageIds[0];
    }
    const service = new serviceModel(serviceData);
    const savedService = await service.save();
    res.json({ result: savedService });
    
  } catch (error) {
    res.json(error.message);
  }
});

router.get("/get/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await serviceModel.findById(id);
    res.json(service);
  } catch (error) {
    res.json(error.message);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const services = await serviceModel.find();
    res.json({ services });
  } catch (error) {
    res.json(error.message);
  }
});

router.get("/delete/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await serviceModel.findByIdAndDelete(id);
    res.json("service deleted");
  } catch (error) {
    res.json(error.message);
  }
});

router.post("/update/:id",validateToken,validate,uploadAndSaveImage, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, phone, email, location,date } = req.body;

    const checkIfOfferExist = await serviceModel.findOne({ name });
    if (checkIfOfferExist) {
      throw new Error("Service already exist!");
    }

    const serviceData ={
      name,
      description,
      location,
      phone,
      email,
      date,
    };
    if (req.body.imageIds) {
      serviceData.image = req.body.imageIds[0];
    }
    await serviceModel.findByIdAndUpdate(id,serviceData);
    const serviceView = await serviceModel.findById(id);
    res.json({ serviceView });
  } catch (error) {
    res.json(error.message);
    
  }
});

router.post("/search", async (req, res, next) => {
  try {
    const { search } = req.body;
    console.log(search);
    let services = [];
    if (!services) {
      services = await serviceModel.find();
    } else {
      services = await serviceModel.find({ name:{$regex:search} });
    }
    res.json({ services });
  } catch (error) {
    res.json(error.message);
  }
});

router.post("/searchFilters", async (req, res, next) => {
  try {
    const { name, description, location,date } = req.body;
    let services = [];
    if (!services) {
      services = await serviceModel.find();
    } else {
      const query = {};
      if (name) {
        query.name = { $regex: name, $options: "i" };
      }
      if (description) {
        query.description = { $regex: description, $options: "i" };
      }
      if (location) {
        query.location = { $regex: location, $options: "i" };
      }
      if (date) {
        const parsedDate = new Date(date);
        query.date = { $eq: parsedDate };  
      }
      services = await serviceModel.find(query).sort({ createdAt: -1 });
    }
    res.json({ services });
  } catch (error) {
    res.json(error.message);
  }
});

router.post("/sort", async (req, res, next) => {
  try {
    const { field, order } = req.body;

    let sortValue;
    if (order === "asc") {
      sortValue = 1; 
    } else {
      sortValue = -1; 
    }
    console.log(field,order);
    const sortOptions = {};
    sortOptions[field] = sortValue;

    const services = await serviceModel
    .find()
    .collation({ caseLevel:true,locale:"en_US" })
    .sort(sortOptions).limit(5);    
    
    res.json({ services });
  } catch (error) {
    res.json(error.message);
  }
});

router.get("/page", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page (default: 1)
    const pageSize = parseInt(req.query.pageSize) || 10; // Page size (default: 10)

    const totalServices = await serviceModel.countDocuments();
    const totalPages = Math.ceil(totalServices / pageSize);

    const services = await serviceModel
      .find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    res.json({ services, totalPages, currentPage: page });
  } catch (error) {
    res.json({ error: error.message });
  }
});

module.exports = router;
