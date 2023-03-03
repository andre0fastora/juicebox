const express = require("express");
const postsRouter = express.Router();
const { getAllPosts, createPost } = require("../db");

postsRouter.use((req, res, next) => {
  console.log("A request is being made to /posts");

  next(); // THIS IS DIFFERENT
});

const { requireUser } = require("./utils");

postsRouter.post("/", requireUser, async (req, res, next) => {
  const { title, content, tags = "" } = req.body;

  const tagArr = tags.trim().split(/\s+/);
  let postData = {};

  // only send the tags if there are some to send
  if (tagArr.length) {
    postData.tags = tagArr;
  }

  try {
    // add authorId, title, content to postData object
    postData = {
      authorId: req.user.id,
      title: title,
      content: content,
      tags: tagArr,
    };
    const post = await createPost(postData);

    // this will create the post and the tags for us
    // if the post comes back, res.send({ post });
    // otherwise, next an appropriate error object
    if (post) {
      res.send({ post });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.get("/", async (req, res) => {
  const posts = await getAllPosts();

  res.send({
    posts: [posts],
  });
});

module.exports = postsRouter;
