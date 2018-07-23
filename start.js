const db = require('./server/db/database')
const app = require('./server')
const PORT = process.env.PORT || 3000

db.sync()
  .then(function() {
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}.`)
    })
  })
