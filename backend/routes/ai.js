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

  /*
    Răspunsul nu mai este trimis tot deodată.

    Backend-ul poate trimite mai multe mesaje către frontend
    în timpul aceluiași request.
  */
  res.setHeader(
    'Content-Type',
    'application/x-ndjson; charset=utf-8'
  )

  res.setHeader(
    'Cache-Control',
    'no-cache, no-transform'
  )

  res.setHeader(
    'Connection',
    'keep-alive'
  )

  res.setHeader(
    'X-Accel-Buffering',
    'no'
  )

  res.flushHeaders()

  if (res.socket) {
    res.socket.setNoDelay(true)
  }
  
  function sendEvent(data) {
    res.write(`${JSON.stringify(data)}\n`)

    if (typeof res.flush === 'function') {
      res.flush()
    }
  }

  /*
    Trimite unul dintre mesajele de progres.
  */
  function sendProgress(message) {
    console.log(message)

    sendEvent({
      type: 'progress',
      message
    })
  }

  try {
    sendProgress(
      'Generating itinerary draft...'
    )

    const draft = await generateItineraryDraft(
      tripForm
    )

    /*
      Acest log rămâne doar în terminal.
      NU îl trimitem în frontend.
    */
    console.log('Itinerary draft generated.')

    sendProgress(
      'Verifying places with Google Places...'
    )

    const enrichedItinerary = await enrichItinerary(
      draft
    )

    /*
      Doar terminal.
    */
    console.log('Place verification complete.')

    sendProgress(
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

    sendProgress(
      'Calculating final routes...'
    )

    const itineraryWithRoutes =
      await addRoutesToItinerary(finalItinerary)

    /*
      Doar terminal.
    */
    console.log('Final route calculation complete.')

    sendProgress(
      'Itinerary optimization complete.'
    )

    /*
      Trimitem separat rezultatul final.
    */
    sendEvent({
      type: 'result',
      itinerary: itineraryWithRoutes
    })

    res.end()
  } catch (error) {
    console.error(
      'Itinerary generation error:',
      error
    )

    sendEvent({
      type: 'error',
      message: 'Could not generate itinerary'
    })

    res.end()
  }
})

module.exports = router