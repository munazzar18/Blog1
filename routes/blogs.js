const express = require('express')
const router = express.Router()
const fetchUser = require('../middleware/fetchUser')
const Blogs = require('../models/Blogs')
const {body , validationResult } = require('express-validator')
const fetchCategory = require('../middleware/fetchCategory')

//Route 1: Get all the Blogs using: GET "/api/fetchallblogs" Loging Required
router.get ('/fetchallblogs', fetchUser ,async (req, res) => {
    try {

        const blogs = await Blogs.find({
            user : req.user.id
        }).populate('category', 'content');

        

        res.json(blogs)
    } catch (err ){
        console.log(err.message)
        res.status(500).send("Internal Server Error");
    }
})

//Route 2 : Add a new blog post
router.post('/addblog', fetchUser, fetchCategory, [
    body('title', 'Enter a valid title').isLength({min : 3}),
    body('description', 'Description must be 5 character long').isLength({min : 5})
], async (req, res) => {
    try {
        const { title, description} = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({errors : errors.array()});
        }

        const blog = new Blogs ({
            title,
            description,
            category : req.category.id,
            user : req.user.id
        })

        const savedBlogs = await blog.save()
        res.json(savedBlogs)
        
    } catch (err){
        console.log(err.message)
        res.status(500).send("Internal Server Error")
    }
})

//Route 3 : update an existing Blog 
router.put('/updateblog', fetchUser, async (req, res) => {
    const { title, description, category, tags} = req.body 
    try {
        const newBlog = {}

        if (title) {
            newBlog.title = title
        }
        if (description){
            newBlog.description = description
        }
        if(category){
            newBlog.category = category
        }
        if (tags){
                newBlog.tags = tags
        }
        let blog = await Blogs.findById(req.params.id)
        if (!blog){
            return res.status(404).send("Not Found")
        }
        if (blog.user.toString() !== req.user.id){
            return res.status(401).send('Not Allowed')
        }

        blog = await Blogs.findByIdAndUpdate(req.params.id, {$set : newBlog}, {new : true} )
        res.json({blog})

    } catch(err){ 
        console.log(err.message)
        res.status(500).send("Internal Server Error")
    }
})

//Router 4 : Delete an existing blog 
router.delete('/deleteblog', fetchUser, async(req, res) => {
    try { 
        let blog = await Blogs.findById(req.params.id)
        if (!blog){
            return res.status(404).send("Not Found")
        }
        if (blog.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed")
        }
        blog = await Blogs.findByIdAndDelete(req.params.id)
        res.json({"Success" : "Blog has been deleted successfully"})
    } catch (err){
        console.log(err.message)
        res.status(500).send('Internal Server Fail')
    }
})

module.exports = router;
