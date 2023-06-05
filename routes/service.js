const express = require("express");
const serviceModel = require("../models/service");
const validate = require("../middlewares/validateService");
const router = express.Router();



router.post("/add",validate, async (req, res, next) => {
  try {
    const { name, description, image, phone, email, location,date } = req.body;

    const checkIfOfferExist = await serviceModel.findOne({ name });
    if (checkIfOfferExist) {
      throw new Error("Service already exist!");
    }

    const service = new serviceModel({
      name: name,
      description: description,
      location: location,
      image: image,
      phone: phone,
      email: email,
      date:date,
    });

    service.save();
    res.json("Service Added");
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

router.post("/update/:id",validate, async (req, res, next) => {
  try {
    const { id } = req.params;
    await serviceModel.findByIdAndUpdate(id,req.body);
    const service = await serviceModel.findById(id);
    res.json({ service });
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

module.exports = router;
