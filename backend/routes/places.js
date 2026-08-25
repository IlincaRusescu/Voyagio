const express = require('express')
const { searchPlaces } = require('../services/googlePlaces')

const router = express.Router()

router.get('/search', async (req, res) => {
  const query = req.query.query

  if (!query) {
    return res.status(400).json({
      error: 'Missing query parameter'
    })
  }

  try {
    const places = await searchPlaces(query)

    return res.json({
      query,
      places
    })
  } catch (error) {
    console.error('Places search error:', error)

    return res.status(500).json({
      error: 'Could not search places'
    })
  }
})

module.exports = router