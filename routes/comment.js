var express = require('express');
const commentModel = require("../models/comment");
const userModel = require("../models/user");
const postModel = require("../models/post");



var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json("welcome to comment");
});

router.post(
  "/add",
  async (req, res, next) => {
    
    try {
      const {text,post} = req.body;
      var post_comment = await postModel.findById(post);
      if (!post_comment) {
        throw new Error("post does not exist!");
      }
        
      const comment = new commentModel({
        text: text,
        post: post,
      });

      comment.save();
      res.json(comment);
    } catch (error) {
      res.json(error.message);
    }
  }
);

router.get("/delete/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await commentModel.findByIdAndDelete(id);
    res.json("comment deleted");
  } catch (error) {
    res.json(error.message);
  }
});



router.get("/get/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const comment = await commentModel.findById(id);
    res.json(comment);
  } catch (error) {
    res.json(error.message);
  }
});

router.post("/update/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    var commentaire = await commentModel.findById(id);
    console.log(commentaire);
    const com=await commentModel.findByIdAndUpdate(id,req.body);
    res.json(com);
  } catch (error) {
    res.json(error.message);
  }
});
router.get("/get", async (req, res, next) => {
  try {
    const comments = await commentModel.find();
    res.json(comments);
  } catch (error) {
    res.json(error.message);
  }
});

module.exports = router;
