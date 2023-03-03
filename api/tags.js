const express = require('express');
const tagsRouter = express.Router();
const {  getAllTags, getPostsByTagName, getUserById } = require('../db');
const { requireUser } = require('./utils')

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

tagsRouter.get('/:tagName/posts', requireUser, async (req,res,next) => {
    const tagName = req.params.tagName;

    console.log(tagName, 'tagName');

    try{
        const postsByTagName = await getPostsByTagName(tagName);

        console.log(req.user,  'user structure');

        //STILL NEED TO FILTER THROUGH THINGS- BROKEN:

      const holdTags =   postsByTagName.filter( async (post) => {

        if (req.user && post.author.id == req.user.id) {
            return true;
          }

          if((!post.author.active) && post.author.id == req.user.id){
            return true;
          }

            if(post.author.active){
                return true;
            }

            if(post.active){
                return true;
            }

            if((!post.active) && post.author.id == req.user.id){
                return true;
            }

            if((!post.author.active) && post.author.id != req.user.id){
                return false;
              }

            return false;
        })

        res.send({
            posts: holdTags
        })
    }catch({ name, message }){
        next({ name, message });
    }
})

module.exports = tagsRouter;