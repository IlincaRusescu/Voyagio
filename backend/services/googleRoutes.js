function formatDuration(duration) {
  if (!duration) {
    return null
  }

  const seconds = Number(duration.replace('s', ''))
  const minutes = Math.round(seconds / 60)

  if (minutes < 60) {
    return `${minutes} min`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes === 0) {
    return `${hours} h`
  }

  return `${hours} h ${remainingMinutes} min`
}

function formatDistance(distanceMeters) {
  if (distanceMeters === undefined || distanceMeters === null) {
    return null
  }

  if (distanceMeters < 1000) {
    return `${distanceMeters} m`
  }

  return `${(distanceMeters / 1000).toFixed(1)} km`
}

async function calculateRoute(origin, destination, travelMode) {
  const allowedModes = ['WALK', 'DRIVE', 'TRANSIT']

  if (!allowedModes.includes(travelMode)) {
    throw new Error('Invalid travel mode')
  }

  const response = await fetch(
    'https://routes.googleapis.com/directions/v2:computeRoutes',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
        'X-Goog-FieldMask':
          'routes.distanceMeters,routes.duration'
      },
      body: JSON.stringify({
        origin: {
          location: {
            latLng: {
              latitude: origin.latitude,
              longitude: origin.longitude
            }
          }
        },

        destination: {
          location: {
            latLng: {
              latitude: destination.latitude,
              longitude: destination.longitude
            }
          }
        },

        travelMode
      })
    }
  )

  if (!response.ok) {
    const errorData = await response.json()

    console.error('Google Routes API error:', errorData)

    throw new Error('Google Routes request failed')
  }

  const data = await response.json()

  const route = data.routes?.[0]

  if (!route) {
    return null
  }

  return {
    travelMode,
    distanceMeters: route.distanceMeters,
    distance: formatDistance(route.distanceMeters),
    durationSeconds: Number(route.duration?.replace('s', '')),
    duration: formatDuration(route.duration)
  }
}

module.exports = {
  calculateRoute
}