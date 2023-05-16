const express = require('express')
const router = express.Router()
const fetchUser = require('../middleware/fetchUser')
const Comments = require('../models/Comments')
const {body , validationResult } = require('express-validator')

//Route 1 : Get all Comments 
router.get('/', fetchUser, async(req, res) => {
    try {
        const comments = await Comments.find({
            user : req.user.id,
            blogId : req.params.blogId
        })
        res.json(comments)
    } catch(err){
        console.log(err.message)
        res.status(500).send("Internal Server Error")
    }
})

//Route 2 : Create a new comment
router.post('/', fetchUser, async(req, res) => {
    try {
        const { content } = req.body 
        console.log(content)
        const comment = new Comments({
            content,
            blogId : req.params.blogId,
            user : req.user.id
            
        })
        const savedComment = await comment.save()
        res.json(savedComment)
    } catch(err){
        console.log(err.message)
        res.status(500).send("Internal Server Error")
    }
})

module.exports = router;
