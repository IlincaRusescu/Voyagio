const { searchPlaces } = require('./googlePlaces')

function buildVerifiedPlace(place) {
  if (!place) {
    return {
      verified: false
    }
  }

  return {
    verified: true,
    placeId: place.placeId,
    name: place.name,
    address: place.address,
    latitude: place.latitude,
    longitude: place.longitude
  }
}

async function enrichPlace(searchQuery) {
  try {
    const results = await searchPlaces(searchQuery)

    if (!results || results.length === 0) {
      console.warn(
        `No Google Places result for "${searchQuery}"`
      )

      return {
        verified: false
      }
    }

    return buildVerifiedPlace(results[0])
  } catch (error) {
    console.error(
      `Could not enrich place "${searchQuery}":`,
      error
    )

    return {
      verified: false
    }
  }
}

async function enrichItinerary(itinerary) {
  const enrichedItinerary = JSON.parse(
    JSON.stringify(itinerary)
  )

  for (const stay of enrichedItinerary.stays || []) {
    stay.place = await enrichPlace(
      stay.searchQuery
    )
  }

  for (const day of enrichedItinerary.days || []) {
    for (const activity of day.activities || []) {
      activity.place = await enrichPlace(
        activity.searchQuery
      )
    }
  }

  for (const restaurant of enrichedItinerary.restaurants || []) {
    restaurant.place = await enrichPlace(
      restaurant.searchQuery
    )
  }

  return enrichedItinerary
}

module.exports = {
  enrichItinerary
}