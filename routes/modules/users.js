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
  failureRedirect: '/users/login',
  failureFlash: true
}))

// logout
router.get('/logout', (req, res) => {
  req.logOut()
  req.flash('success_msg', '成功登出。')
  res.redirect('/users/login')
})

// register page
router.get('/register', (req, res) => {
  res.render('register')
})

// register
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!email || !password || !confirmPassword) {
    errors.push({ message: 'EMAIL & PASSWORD & CONFIRM PASSWORD are required!' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: 'PASSWORD and CONFIRM PASSWORD must be the same！' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  User.findOne({ email })
    .then(user => {
      if (user) {
        req.flash('warning_msg', 'Email is registered!')
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