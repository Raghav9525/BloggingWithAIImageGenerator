


const express = require('express')
const router = express.Router();
const blogControllers =  require('../controllers/blog')

router.post('/blog_post', blogControllers.blogPost);
router.get('/get_blog_title', blogControllers.getBlogTitle);
router.get('/fetch_blogs',blogControllers.fetchBlogs)
router.post('/generate_image',blogControllers.generateImage)

// router.post('/store_blog', blogControllers.storeBlog)

module.exports = router;