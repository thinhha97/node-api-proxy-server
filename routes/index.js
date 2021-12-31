const router = require('express').Router()
const needle = require('needle')
const url = require('url')
const apiCache = require('apicache')
const API_BASE_URL = process.env.API_BASE_URL
const API_KEY_NAME = process.env.API_KEY_NAME
const API_KEY_VALUE = process.env.API_KEY_VALUE

let cache = apiCache.middleware

router.get('/', cache('5 minutes'), async (req, res) => {
  try {
    console.log()
    const params = new URLSearchParams({
      [API_KEY_NAME]: API_KEY_VALUE,
      ...url.parse(req.url, true).query,
    })

    apiRes = await needle('get', `${API_BASE_URL}?${params}`)
    const data = apiRes.body

    if (process.env.NODE_ENV !== 'production') {
      console.log(`REQUEST: ${API_BASE_URL}?${params}`)
    }

    res.status(200).json(data)
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router