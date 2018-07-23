const express = require('express')
const path = require('path')
const volleyball = require('volleyball')
const bodyParser = require('body-parser')
const session = require('express-session')
const db = require('./db/database')
const passport = require('passport')

const app = express()
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const dbStore = new SequelizeStore({db: db})

dbStore.sync()

app.use(volleyball)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static(path.join(__dirname, '../public')))

app.use(session({
  secret: process.env.SESSION_SECRET || 'insecure secret here',
  store: dbStore,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => {
  try {
    done(null, user.id)
  } catch (err) {
    done(err)
  }
})

// User not defined
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user))
    .catch(done)
})

app.use('/api', require('./api/'))

app.get('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error')
})

module.exports = app
