const express = require('express');
const tagsRouter = express.Router();
const {  getAllTags, getPostsByTagName } = require('../db');

tagsRouter.use((req, res, next) => {
    console.log("A request is being made to /tags");
  
    next(); // THIS IS DIFFERENT
  });

tagsRouter.get('/', async (req,res,next)  => {
    const tags = await getAllTags()

    res.send({
        tags: [tags]
    })
})

tagsRouter.get('/:tagName/posts', async (req,res,next) => {
    const tagName = req.params.tagName;

    console.log(tagName, 'tagName');

    try{
        const postsByTagName = await getPostsByTagName(tagName);
        console.log(postsByTagName, 'postsByTagName');

        res.send({
            posts: postsByTagName
        })
    }catch({ name, message }){
        next({ name, message });
    }
})

module.exports = tagsRouter;