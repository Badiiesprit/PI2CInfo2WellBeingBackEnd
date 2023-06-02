const express = require("express");
const serviceModel = require("../models/service");
const validate = require("../middlewares/validate");
const router = express.Router();



router.post("/addService",validate, async (req, res, next) => {
  try {
    const { name, description, image, phone, email, location } = req.body;

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
    });

    service.save();
    res.json("Service Added");
  } catch (error) {
    res.json(error.message);
  }
});
router.get("/getById/:id", async (req, res, next) => {
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

router.get("/deleteService/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await serviceModel.findByIdAndDelete(id);
    res.json("service deleted");
  } catch (error) {
    res.json(error.message);
  }
});

router.post("/updateService/:id",validate, async (req, res, next) => {
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

module.exports = router;
