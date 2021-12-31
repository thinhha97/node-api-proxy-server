const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
require('dotenv').config()
const routes = require('./routes')
const PORT = process.env.PORT || 5000

const app = express()
// const limiter = rateLimit({
//   windowsMs: 10 * 60 * 1000,
//   max: 5,
// })
// app.use(limiter)
app.set('trust proxy', 1)
app.use(cors())

app.use(express.static('public'))

app.use('/api', routes)
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
