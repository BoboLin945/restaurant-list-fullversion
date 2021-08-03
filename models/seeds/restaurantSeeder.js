const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Restaurant = require('../restaurant')
const User = require('../user')
const restaurants = require('../../restaurant.json').results
const db = require('../../config/mongoose')

const SEED_USERS = [
  {
    name: 'USER NO.1',
    email: 'user1@example.com',
    password: '12345678',
    restaurantsForUser: restaurants.slice(0, 3)
  },
  {
    name: 'USER NO.2',
    email: 'user2@example.com',
    password: '12345678',
    restaurantsForUser: restaurants.slice(3, 6)
  }
]

db.once('open', () => {
  return Promise.all(SEED_USERS.map(async user => {
    const resList = user.restaurantsForUser
    await User.create({
      name: user.name,
      email: user.email,
      password: bcrypt.hashSync(user.password, bcrypt.genSaltSync(10))
    })
      .then(user => {
        return Promise.all(resList.map(async restaurant => {
          await Restaurant.create({
            name: restaurant.name,
            category: restaurant.category,
            image: restaurant.image,
            location: restaurant.location,
            phone: restaurant.phone,
            google_map: restaurant.google_map,
            rating: restaurant.rating,
            description: restaurant.description,
            userId: user._id
          })
        }))
      })
  }))
    .then(() => {
      console.log('done!')
      process.exit()
    })
})
