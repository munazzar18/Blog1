const express = require('express')
const router = express.Router()
const fetchUser = require('../middleware/fetchUser')
const Blogs = require('../models/Blogs')
const Comments = require('../models/Comments')
const {body , validationResult } = require('express-validator')

//Route 1 : Get all Comments 
router.get('/getallcomments', fetchUser, Blogs, async(req, res) => {
    try {
        const comments = new Comments.find({
            user : req.user.id,
            blog : req.blogs.id
        })
        res.json(comments)
    } catch(err){
        console.log(err.message)
        res.status(500).send("Internal Server Error")
    }
})