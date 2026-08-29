const express = require('express')

const {
  generateItineraryDraft,
  optimizeItineraryByCoordinates
} = require('../services/openai')

const {
  enrichItinerary
} = require('../services/itineraryEnrichment')

const {
  addRoutesToItinerary
} = require('../services/itineraryRoutes')

const router = express.Router()

function applyOptimizedOrder(itinerary, optimization) {
  const optimizedItinerary = JSON.parse(
    JSON.stringify(itinerary)
  )

  for (const optimizedDay of optimization.days || []) {
    const day = optimizedItinerary.days.find(
      (item) => item.dayNumber === optimizedDay.dayNumber
    )

    if (!day) {
      continue
    }

    const activityMap = new Map(
      day.activities.map((activity) => [
        activity.activityId,
        activity
      ])
    )

    const reorderedActivities = []

    for (const activityId of optimizedDay.activityOrder) {
      const activity = activityMap.get(activityId)

      if (activity) {
        reorderedActivities.push(activity)
        activityMap.delete(activityId)
      }
    }

    // Safety fallback:
    // dacă OpenAI uită vreun activityId, îl păstrăm totuși.
    for (const activity of activityMap.values()) {
      reorderedActivities.push(activity)
    }

    day.activities = reorderedActivities
  }

  return optimizedItinerary
}

router.post('/generate-itinerary', async (req, res) => {
  const tripForm = req.body

  if (!tripForm || Object.keys(tripForm).length === 0) {
    return res.status(400).json({
      error: 'Trip form is required'
    })
  }

  try {
    console.log('Generating itinerary draft...')

    const draft = await generateItineraryDraft(
      tripForm
    )

    console.log('Itinerary draft generated.')

    console.log(
      'Verifying places with Google Places...'
    )

    const enrichedItinerary = await enrichItinerary(
      draft
    )

    console.log('Place verification complete.')

    console.log(
      'Optimizing itinerary using coordinates...'
    )

    const optimization =
      await optimizeItineraryByCoordinates(
        enrichedItinerary
      )

    const finalItinerary = applyOptimizedOrder(
      enrichedItinerary,
      optimization
    )

    console.log('Calculating final routes...')

    const itineraryWithRoutes =
      await addRoutesToItinerary(finalItinerary)

    console.log('Final route calculation complete.')

    console.log('Itinerary optimization complete.')

    return res.json({
      itinerary: itineraryWithRoutes
    })
  } catch (error) {
    console.error(
      'Itinerary generation error:',
      error
    )

    return res.status(500).json({
      error: 'Could not generate itinerary'
    })
  }
})

module.exports = router