const express = require("express");
const centerModel = require("../models/center");
const offerModel = require("../models/offer");
const validate = require("../middlewares/validateOffer");
const router = express.Router();



router.post("/add",validate, async (req, res, next) => {
  try {
    const { name, description,location, image, center } = req.body;
    console.log(req.body);
    const checkIfOfferExist = await offerModel.findOne({ name });
    if (checkIfOfferExist) {
      throw new Error("Offer already exist!");
    }
    
    const checkIfCenterExist = await centerModel.findById(center);
    if (!checkIfCenterExist) {
      throw new Error("Center does not exist!");
    }
    console.log(checkIfCenterExist);
    const offer = new offerModel({
      name: name,
      description: description,
      location: location,
      image:image,
      center: checkIfCenterExist,
      
    });

    offer.save();
    res.json("Offer Added");
  } catch (error) {
    res.json(error.message);
  }
});

router.get("/get/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const offer = await offerModel.findById(id);
    res.json(offer);
  } catch (error) {
    res.json(error.message);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const offers = await offerModel.find();
    res.json({ offers });
  } catch (error) {
    res.json(error.message);
  }
});

router.get("/delete/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await offerModel.findByIdAndDelete(id);
    res.json("offer deleted");
  } catch (error) {
    res.json(error.message);
  }
});

router.post("/update/:id",validate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description,location,center } = req.body;
    const checkIfCenterExist = await centerModel.findById(center);
    if (!checkIfCenterExist) {
      throw new Error("Center does not exist!");
    }
    
    await offerModel.findByIdAndUpdate(id,req.body);
    res.json("offer updated");

  } catch (error) {
    res.json(error.message);
  }
});

router.post("/search", async (req, res, next) => {
  try {
    const { search } = req.body;
    console.log(search);
    let offers = [];
    if (!offers) {
      offers = await offerModel.find();
    } else {
      offers = await offerModel.find({ name:{$regex:search} });
    }
    res.json({ offers });
  } catch (error) {
    res.json(error.message);
  }
});

module.exports = router;
