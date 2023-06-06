var express = require('express');
const postModel = require("../models/post");

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json("welcome to post");
});

router.post("/add",async (req, res, next) => {
    
    try {
      const {title , description , short_description} = req.body;
      const checkIfpostExist = await postModel.findOne({ title });
      if (checkIfpostExist) {
        throw new Error("post  already exist!");
      }
     
      
      const post = new postModel({
        title: title,
        description: description,
        short_description,
      });

      post.save();
      res.json(post);
    } catch (error) {
      res.json(error.message);
    }
  }
);

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
    const post = await postModel.findById(id);
    res.json(post);
  } catch (error) {
    res.json(error.message);
  }
});

router.post("/update/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    var post = await postModel.findById(id);
    console.log(post);
    console.log(title);
    if(post.title!=title){
      const checkIfpostExist = await postModel.find({ title });
      if (!(checkIfpostExist)) {
        throw new Error("post already exist!");
      }
    }
    await postModel.findByIdAndUpdate(id, req.body);
    post = await postModel.findById(id);
    res.json(post);
  } catch (error) {
    res.json(error.message);
  }
});
router.get("/get", async (req, res, next) => {
  try {
    const posts = await postModel.find();
    res.json(posts);
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




router.post('/like/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId;

    const post = await Post.findById(id);

    if (post.likedBy.includes(userId)) {
      throw new Error('Vous avez déjà liké cette publication');
    }

    post.likedBy.push(userId);
    post.likes += 1;
    await post.save();

    res.json({ message: 'Publication likée avec succès' });
  } catch (error) {
    res.json({ error: error.message });
  }
});


module.exports = router;
