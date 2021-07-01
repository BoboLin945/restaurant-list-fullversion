const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
// Require handlebars and just-handlebars-helpers
const Handlebars = require('handlebars')
const H = require('just-handlebars-helpers')

const routes = require('./routes')

const usePassport = require('./config/passport')

const app = express()
// Register just-handlebars-helpers with handlebars
H.registerHelpers(Handlebars);

// template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

// setting methodOverride
app.use(methodOverride('_method'))

// session
app.use(session({
  secret: 'restaurantLocalSecret',
  resave: false,
  saveUninitialized: true,
}))

// passport
usePassport(app)

// res.locals setting middleware
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})

// mongoose connect to mongoDB
require('./config/mongoose')

// route setting
app.use(routes)

// setting port
app.listen(3000, () => {
  console.log(`App is running on http://localhost:3000`)
})

