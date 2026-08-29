const { calculateRoute } = require('./googleRoutes')

async function calculateTravelOptions(origin, destination) {
  const result = {
    walking: null,
    transit: null,
    driving: null
  }

  try {
    result.walking = await calculateRoute(
      origin,
      destination,
      'WALK'
    )
  } catch (error) {
    console.error('Walking route failed:', error.message)
  }

  try {
    result.transit = await calculateRoute(
      origin,
      destination,
      'TRANSIT'
    )
  } catch (error) {
    console.error('Transit route failed:', error.message)
  }

  try {
    result.driving = await calculateRoute(
      origin,
      destination,
      'DRIVE'
    )
  } catch (error) {
    console.error('Driving route failed:', error.message)
  }

  return result
}

async function addRoutesToItinerary(itinerary) {
  const itineraryWithRoutes = JSON.parse(
    JSON.stringify(itinerary)
  )

  for (const day of itineraryWithRoutes.days || []) {
    const activities = day.activities || []

    for (let i = 0; i < activities.length - 1; i++) {
      const currentActivity = activities[i]
      const nextActivity = activities[i + 1]

      const currentPlace = currentActivity.place
      const nextPlace = nextActivity.place

      if (
        !currentPlace?.verified ||
        !nextPlace?.verified
      ) {
        currentActivity.routeToNext = null
        continue
      }

      const origin = {
        latitude: currentPlace.latitude,
        longitude: currentPlace.longitude
      }

      const destination = {
        latitude: nextPlace.latitude,
        longitude: nextPlace.longitude
      }

      console.log(
        `Calculating routes: ${currentActivity.name} → ${nextActivity.name}`
      )

      const routes = await calculateTravelOptions(
        origin,
        destination
      )

      currentActivity.routeToNext = {
        destinationActivityId: nextActivity.activityId,
        destinationName: nextActivity.name,
        walking: routes.walking,
        transit: routes.transit,
        driving: routes.driving
      }
    }

    if (activities.length > 0) {
      activities[activities.length - 1].routeToNext = null
    }
  }

  return itineraryWithRoutes
}

module.exports = {
  addRoutesToItinerary
}