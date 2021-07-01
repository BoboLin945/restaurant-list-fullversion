const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Restaurant = require('../restaurant')
const User = require('../user')
const restaurants = require('../../restaurant.json')
const db = require('../../config/mongoose')

const user1 = []
for (let i = 0; i < restaurants.results.length; i++) {
  if (restaurants.results[i].id < 4) {
    user1.push(restaurants.results[i])
  }
}
const user2 = []
for (let i = 0; i < restaurants.results.length; i++) {
  if (restaurants.results[i].id > 3 && restaurants.results[i].id < 7 ) {
    user2.push(restaurants.results[i])
  }
}

const SEED_USERS = [
  {
    email: 'user1@example.com',
    password: '12345678',
  },
  {
    email: 'user2@example.com',
    password: '12345678',
  }
]

db.once('open', () => {
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USERS[0].password, salt))
    .then(hash => 
      User.create({
        email: SEED_USERS[0].email,
        password: hash
      }))
    .then(user => {
      const userId = user._id
      return Promise.all(Array.from(
        {length: user1.length},
        (_, i) => Restaurant.create({ 
          name:user1[i].name,
          category: user1[i].category,
          image: user1[i].image,
          location: user1[i].location,
          phone: user1[i].phone,
          google_map: user1[i].google_map,
          rating: user1[i].rating,
          description: user1[i].description,
          userId
        })
      ))
    })
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USERS[1].password, salt))
    .then(hash =>
      User.create({
        email: SEED_USERS[1].email,
        password: hash
      }))
    .then(user => {
      const userId = user._id
      return Promise.all(Array.from(
        { length: user2.length },
        (_, i) => Restaurant.create({
          name: user2[i].name,
          category: user2[i].category,
          image: user2[i].image,
          location: user2[i].location,
          phone: user2[i].phone,
          google_map: user2[i].google_map,
          rating: user2[i].rating,
          description: user2[i].description,
          userId
        })
      ))
    })
    .then(() => {
      console.log('done!')
      process.exit()
    })
})