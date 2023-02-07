const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

//create post

router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(error);
  }
});

//update post

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (error) {}
    } else {
      res.status(401).json("You can update only your post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//detele post

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json("Post has been deleted");
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(401).json("You can only delete your posts");
    }
  } catch (error) {
    res.status(404).json("this post doest exist");
  }
});

// get post

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json("No such post exists");
  }
});

// get all posts
router.get("/", async (req, res) => {
  const username = req.query.user;
  const catname = req.query.cat;

  try {
    let posts;
    // if query has username fetch all posts of that user
    if (username) {
      posts = await Post.find({ username: username });
    } 
      //if query has categories fetch all the posts of that category

    else if (catname) {
      posts = await Post.find({ categories: { $in: [catname] } });
    } 
    // if no query then fetch all the datas
    else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json("No such post exists");
  }
});

module.exports = router;
