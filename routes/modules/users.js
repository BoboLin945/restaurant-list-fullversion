const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')

// login page
router.get('/login', (req, res) => {
  res.render('login')
})

// login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

// register page
router.get('/register', (req, res) => {
  res.render('register')
})

// register
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  User.findOne({email})
    .then(user => {
      if (user) {
        console.log('User already exists.')
        res.render('register', {
          name,
          email,
          password,
          confirmPassword
        })
      } else {
        User.create({
          name,
          email,
          password,
          confirmPassword
        })
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
      }
    })
})

module.exports = router