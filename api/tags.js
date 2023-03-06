const express = require("express");
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName, getUserById } = require("../db");
const { requireUser } = require("./utils");

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next(); // THIS IS DIFFERENT
});

tagsRouter.get("/", async (req, res, next) => {
  const tags = await getAllTags();

  res.send({
    tags: [tags],
  });
});

tagsRouter.get("/:tagName/posts", requireUser, async (req, res, next) => {
  const { tagName } = req.params;

  console.log(tagName, "tagName");

  try {
    const postsByTagName = await getPostsByTagName(tagName);

    console.log(req.user, "user structure");

    //STILL NEED TO FILTER THROUGH THINGS- BROKEN:

    const holdTags = postsByTagName.filter((post) => {
      console.log(postsByTagName, "postsByTagName");
      if (post.author.active) {
        console.log("hello from line 35");
        // if (post.author.id === 1) {
        //   console.log("post.author.active");
        // }
        return true;
      }
      if (post.author.active === false && post.author.id !== req.user.id) {
        if (post.author.id === 1) {
          console.log("!post.author.active && post.author.id != req.user.id");
        }
        return false;
      }
      if (post.author.id === req.user.id) {
        if (post.author.id === 1) {
          console.log("req.user && post.author.id == req.user.id");
        }
        return true;
      }

      if (post.author.active === false && post.author.id == req.user.id) {
        if (post.author.id === 1) {
          console.log("!post.author.active && post.author.id == req.user.id");
        }
        return true;
      }

      if (post.active) {
        if (post.author.id === 1) {
          console.log("post.active");
        }
        return true;
      }

      if (!post.active && post.author.id === req.user.id) {
        if (post.author.id === 1) {
          console.log("!post.active && post.author.id == req.user.id");
        }
        return true;
      }

      return false;
    });

    console.log(holdTags, "Tag array to return");

    res.send({
      posts: holdTags,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = tagsRouter;
