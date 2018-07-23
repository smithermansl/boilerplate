const express = require('express')
const path = require('path')
const volleyball = require('volleyball')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 3000

const app = express()

app.use(volleyball)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static(path.join(__dirname, '../public')))

app.use('/api', require('./api/'))

app.get('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error')
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`)
})

module.exports = app
