const { create, AllPosts } = require('../controllers/post.controller');
const { authentication } = require('../middleware/authentication');
const { validatePost } = require('../middleware/postValidation');


const express = require('express');

const post_router = express.Router();

post_router
.post("/",authentication,validatePost,create)
.get("/allPosts", AllPosts)

module.exports = { post_router };