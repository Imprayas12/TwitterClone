const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const path = require('path')
const app = express()
const User = require('./schema/User')
const Tweets = require('./schema/Tweets')
const PORT = 3000
app.set('view engine', 'ejs')
app.set(express.static(path.join(__dirname, 'views')))
app.use(express.urlencoded({extended:true}))
app.set('trust proxy', 1) 
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))
mongoose.connect('mongodb://127.0.0.1/twitterDB').then(() => console.log("DB connected")).catch(err => console.log(err));

function isAuthenticated (req, res, next) {
    if(req.session.emailId) next()
    else res.redirect('/register')
}  

app.get('/',isAuthenticated, (req, res) => {
    res.render('home')
})

app.get('/register',(req, res) => {
    res.render('register')
})

app.post('/register',(req, res) => {
    const {emailId, password, url} = req.body;
    let saltRounds = 10;
    bcrypt.genSalt(saltRounds,(err, salt)  => {
        bcrypt.hash(password, salt, async (err, hash) => {
            const user = await User.create({
                emailId: emailId,
                hash: hash,
                url: url
            });
        });
    });
    res.redirect('/login')
})


app.get('/login',(req, res) => {
    res.render('login')
})

app.post('/login',async (req, res) => {
    const {emailId, password} = req.body;
    const entry = await User.findOne({emailId:emailId})
    const r = await bcrypt.compare(password, entry.hash);
    console.log(r);
    if(r) {
        req.session.regenerate((err) => {
            if (err) next(err)
            req.session.emailId = emailId;
            req.session.save((err) => {
              if (err) return next(err)
              res.redirect('/')
            })
          })
    }
    else res.redirect('/login')
})

app.get('/logout',(req, res) => {
    req.session.emailId = null
    req.session.save(function (err) {
    if (err) next(err)
    req.session.regenerate(function (err) {
      if (err) next(err)
      res.redirect('/')
    })
  })
})

app.listen(PORT,() => {
    console.log(`server running at port ${PORT}`);
})