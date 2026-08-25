const express = require('express')
const { calculateRoute } = require('../services/googleRoutes')

const router = express.Router()

router.post('/calculate', async (req, res) => {
  const {
    origin,
    destination,
    travelMode
  } = req.body

  if (
    !origin ||
    !destination ||
    origin.latitude === undefined ||
    origin.longitude === undefined ||
    destination.latitude === undefined ||
    destination.longitude === undefined
  ) {
    return res.status(400).json({
      error: 'Origin and destination coordinates are required'
    })
  }

  if (!travelMode) {
    return res.status(400).json({
      error: 'Travel mode is required'
    })
  }

  try {
    const route = await calculateRoute(
      origin,
      destination,
      travelMode.toUpperCase()
    )

    if (!route) {
      return res.status(404).json({
        error: 'No route found'
      })
    }

    return res.json({
      origin,
      destination,
      route
    })
  } catch (error) {
    console.error('Route calculation error:', error)

    return res.status(500).json({
      error: 'Could not calculate route'
    })
  }
})

module.exports = router