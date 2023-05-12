const mongoose = require('mongoose')
const tweetsSchema = new mongoose.Schema({
    tweetText:{
        type:String
    },
    emailId: {
        type:String
    }
})

const Tweets = new mongoose.model('Tweet',tweetsSchema)
module.exports = Tweets