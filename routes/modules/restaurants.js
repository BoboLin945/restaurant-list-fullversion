// 引用 express & express router
const express = require('express')
const router = express.Router()
// 引用 Restaurant model
const Restaurant = require('../../models/restaurant')

// define restaurants route
router.get('/new', (req, res) => {
  return res.render('new')
})

// Search
router.get('/search', (req, res) => {
  const userId = req.user._id
  const keyword = req.query.keyword
  const regex = new RegExp(keyword, 'i') // i for case insensitive
  Restaurant.find({ userId, $or: [{ name: { $regex: regex } }, { category: { $regex: regex } }] })
    .lean()
    .then(restaurants => {
      let message
      if (restaurants.length === 0) {
        message = `Oops! 關鍵字'${keyword}' 無相關結果！`
      }
      res.render('index', { restaurants, keyword, message })
    })
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
  return Restaurant.findOne({ _id, userId })
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
  const { name, category, image, location, phone, google_map, rating, description } = req.body
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

// Sort
router.post('/sort', function (req, res) {
  const sortOption = req.body.sort
  const userId = req.user._id
  Restaurant.find({ userId })
    .lean()
    .sort(getSortMethod(sortOption))
    .then(restaurants => res.render('index', { restaurants, sortOption }))
    .catch(error => console.log(error))
})

// sorting function
function getSortMethod(sortOption) {
  if (sortOption === 'desc') {
    return { name: 'desc' }
  } else if (sortOption === 'asc') {
    return { name: 'asc' }
  } else if (sortOption === 'category') {
    return { category: 'asc' }
  } else if (sortOption === 'rating') {
    return { rating: -1 }
  } else if (sortOption === 'default') {
    return { name: 'asc' }
  }
}

// export route module
module.exports = router