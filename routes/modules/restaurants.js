// 引用 express & express router
const express = require('express')
const router = express.Router()
// 引用 Todo model
const Restaurant = require('../../models/restaurant')

// define restaurants route
router.get('/new', (req, res) => {
  return res.render('new')
})

// Search
router.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const regex = new RegExp(keyword, 'i') // i for case insensitive
  Restaurant.find({ $or: [{ name: { $regex: regex } }, { category: { $regex: regex } }] })
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

// Create
router.post('/', (req, res) => {
  const userId = req.user._id
  const { name, category, image, location, phone, google_map, rating, description } = req.body
  return Restaurant.create({
    name, 
    category, 
    image, 
    location, 
    phone, 
    google_map, 
    rating, 
    description,
    userId
  })
    .then(() => { res.redirect('/') })
    .catch(error => console.log(error))
})

// Read
router.get('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId})
    .lean()
    .then((restaurant) => res.render('detail', { restaurant }))
    .catch(error => console.log(error))
})

// Update (Edit)
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const { name, category, image, location, phone, google_map, rating, description} = req.body
  return Restaurant.findOne({ _id, userId })
    .then(restaurant => {
      restaurant.name = name,
      restaurant.category = category,
      restaurant.image = image,
      restaurant.location = location,
      restaurant.phone = phone,
      restaurant.google_map = google_map,
      restaurant.rating = rating,
      restaurant.description = description,
      restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(error => console.log(error))
})

// Delete
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

router.post('/sort', function (req, res) {
  const sortOption = req.body.sort
  if (sortOption === '0') {
    Restaurant.find()
      .lean()
      .then(restaurants => res.render('index', { restaurants, sortOption }))
      .catch(error => console.error(error))
  }
  if (sortOption === '1') {
    Restaurant.find()
      .lean()
      .sort({ _id: 'desc' })
      .then(restaurants => res.render('index', { restaurants, sortOption }))
      .catch(error => console.error(error))
  }
  if (sortOption === '2') {
    Restaurant.find()
      .lean()
      .sort({ _id: 'asc' })
      .then(restaurants => res.render('index', { restaurants, sortOption }))
      .catch(error => console.error(error))
  }
  if (sortOption === '3') {
    Restaurant.find()
      .lean()
      .sort({ category: 'asc' })
      .then(restaurants => res.render('index', { restaurants, sortOption }))
      .catch(error => console.error(error))
  }
  if (sortOption === '4') {
    Restaurant.find()
      .lean()
      .sort({ rating: -1 })
      .then(restaurants => res.render('index', { restaurants, sortOption }))
      .catch(error => console.error(error))
  }
})

// export route module
module.exports = router