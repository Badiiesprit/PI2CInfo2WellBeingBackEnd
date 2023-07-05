const postModel = require("../models/post");
const validateToken = require("../middlewares/validateToken");
const uploadAndSaveImage = require("../middlewares/uploadAndSaveImage");
const express = require("express");
const mongoose = require("mongoose");
var router = express.Router();


router.get("/", async (req, res, next) => {
  try {
    const posts = await postModel.find().populate('image');
    res.json({ posts });
  } catch (error) {
    res.json(error.message);
  }
});

router.post("/add",uploadAndSaveImage, async (req, res, next) => {
  try {
    console.log(req.body);
    const {title , description , short_description} = req.body;

    const checkIfpostExist = await postModel.findOne({ title });
    if (checkIfpostExist) {
      throw new Error("post  already exist!");
    }
    const postData ={
      title: title,
      description: description,
      short_description,
    };
    if (req.body.imageIds) {
      postData.image = req.body.imageIds[0];
    }
    const post = new postModel(postData);
    post._id = new mongoose.Types.ObjectId();
    const savedPost = await post.save();
    res.json({ result: savedPost });
    
  } catch (error) {
    // res.json(error.message);
    console.log(error.message);
  }
});





router.get("/delete/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await postModel.findByIdAndDelete(id);
    res.json("post deleted");
  } catch (error) {
    res.json(error.message);
  }
});

router.get("/get/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await postModel.findById(id).populate('image');;
    res.json(post);
  } catch (error) {
    res.json(error.message);
  }
});

router.post("/update/:id",uploadAndSaveImage,async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const {title , description , short_description} = req.body;

    const checkIfpostExist = await postModel.findOne({ title });
    if (checkIfpostExist) {
      throw new Error("post  already exist!");
    }
    const postData ={
      title: title,
      description: description,
      short_description,
    };

    if (req.body.imageIds) {
      postData.image = req.body.imageIds[0];
    }
    await postModel.findByIdAndUpdate(id,postData);
    const postView = await postModel.findById(id);
    res.json({ postView });
  } catch (error) {
    res.json(error.message);
    
  }
});



router.post("/search", async (req, res, next) => {
  try {
    const { search } = req.body;
    console.log(search);
    let posts = [];
    if (!posts) {
      posts = await postModel.find();
    } else {
      posts = await postModel.find({ name:{$regex:search} });
    }
    res.json({ posts });
  } catch (error) {
    res.json(error.message);
  }
});




router.post('/like/:id',validateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.body.currentUser;
    

    const post = await postModel.findById(id);

    if (post.likedBy.includes(userId)) {
      throw new Error('Vous avez déjà liké cette publication');
    }
    if (post.dislikedBy.includes(userId)) {
      post.dislikedBy.pull(userId);
      post.dislikes -= 1;
    }

    post.likedBy.push(userId);
    post.likes += 1;
    await post.save();

    res.json({ message: 'Publication likée avec succès' });
  } catch (error) {
    res.json({ error: error.message });
  }
});




router.post('/dislike/:id',validateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.body.currentUser;
    

    const post = await postModel.findById(id);

    if (post.dislikedBy.includes(userId)) {
      throw new Error('Vous avez déjà disliké cette publication');
    }
    if (post.likedBy.includes(userId)) {
      post.likedBy.pull(userId);
      post.likes -= 1;
    }

    post.dislikedBy.push(userId);
    post.dislikes += 1;
    await post.save();

    res.json({ message: 'Publication dislikée avec succès' });
  } catch (error) {
    res.json({ error: error.message });
  }
});


router.get("/enable-disable/:id", async (req, res) => {
  const postId = req.params.id;
  
  try {
    const post = await postModel.findById(postId);
    if (post) {
      post.disable = !post.disable;
      await post.save();
      res.json({ disable:post.disable });
    } else {
      res.json({ error: "post not found" });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});



module.exports = router;
