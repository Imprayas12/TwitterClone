const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    emailId: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    url: {
        type: String
    }
})

const User = mongoose.model('User',userSchema)
module.exports = User