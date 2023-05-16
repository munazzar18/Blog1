const mongoose = require("mongoose")

const Schema = mongoose.Schema

const commentsSchema = new Schema({

    content : {
        type : String,
        required : true
    },
    
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },

    blogId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'blogs'
    }

})

module.exports = mongoose.model('comments', commentsSchema)