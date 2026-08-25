const express = require('express')
const {
  generateItineraryDraft
} = require('../services/openai')

const router = express.Router()

router.post('/generate-itinerary', async (req, res) => {
  const tripForm = req.body

  if (!tripForm || Object.keys(tripForm).length === 0) {
    return res.status(400).json({
      error: 'Trip form is required'
    })
  }

  try {
    const itinerary = await generateItineraryDraft(tripForm)

    return res.json({
      itinerary
    })
  } catch (error) {
    console.error('Itinerary generation error:', error)

    return res.status(500).json({
      error: 'Could not generate itinerary'
    })
  }
})

module.exports = router