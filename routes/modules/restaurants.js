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
  const addItem = req.body
  return Restaurant.create({
    name: addItem.name,
    category: addItem.category,
    image: addItem.image,
    location: addItem.location,
    phone: addItem.phone,
    google_map: addItem.google_map,
    rating: addItem.rating,
    description: addItem.description,
  })
    .then(() => { res.redirect('/') })
    .catch(error => console.log(error))
})

// Read
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('detail', { restaurant }))
    .catch(error => console.log(error))
})

// Update (Edit)
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  const editItem = req.body
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = editItem.name,
        restaurant.category = editItem.category,
        restaurant.image = editItem.image,
        restaurant.location = editItem.location,
        restaurant.phone = editItem.phone,
        restaurant.google_map = editItem.google_map,
        restaurant.rating = editItem.rating,
        restaurant.description = editItem.description,
        restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

// Delete
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// export route module
module.exports = router