const mongoose = require('mongoose')

const Schema = mongoose.Schema

const categorySchema = new Schema({
    content : {
        type : String,
        required : true
    }, 
    blogs : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'blogs'
    }]
})

module.exports = mongoose.model('category', categorySchema)