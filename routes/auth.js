const express = require('express')
const router = express.Router()
const User = require('../models/User')
const {body, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const JWT_SECRET = "This is a blog secret code"
const fetchUser = require('../middleware/fetchUser')
const bcrypt = require('bcrypt')

//Route 1: Create a new user
router.post('/createUser', [
    body('name').isLength({min : 3}),
    body('email').isEmail(),
    body('password').isLength({min : 5})
], async (req, res) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    let user = await User.findOne({email : req.body.email})
    if (user){
        return res.status(400).json({message : "Sorry a user with same email already exists"})
    }
    try {
        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(req.body.password, salt)

        user = await User.create({
            name: req.body.name,
            email : req.body.email,
            password : secPass
        })
        const data = {
            user: {
                id : user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET)
        res.json({authToken})

    } catch(err){
        console.log(err.message)
        res.status(500).send("Internal Server Error")
    }
})

//Route 2 
router.post('/login', [
    body('email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async(req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const { email, password} = req.body
    try {

        let user = await User.findOne({email})
        if (!user){
            return res.status(400).json({error: "Please use correct email"})
        }

      //compare password using bcrypt
      const passwordCompare = await bcrypt.compare(password, user.password);
      if(!passwordCompare){
    
        return res.status(400).json({error: "Please use correct Password"})
      }
        const data = {
            user: {
                id : user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        res.json({authToken})

    } catch(err){
        console.log(err.message)
        res.status(500).send("Internal Server Error")
    }
})

//Route 3 
router.post('/getuser', fetchUser, async(req, res) => {
    try {

        const userid = req.user.id
        const user = await User.findById(userid).select("-password")
        res.send(user)

    } catch (err) {
        console.log(err.message)
        res.status(500).send("Internal Server Error")
    }
})

module.exports = router