async function searchPlaces(query) {
  const response = await fetch(
    'https://places.googleapis.com/v1/places:searchText',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
        'X-Goog-FieldMask':
          'places.id,places.displayName,places.formattedAddress,places.location'
      },
      body: JSON.stringify({
        textQuery: query
      })
    }
  )

  if (!response.ok) {
    const errorData = await response.json()

    console.error('Google Places API error:', errorData)

    throw new Error('Google Places request failed')
  }

  const data = await response.json()

  const places =
    data.places?.map((place) => ({
      placeId: place.id,
      name: place.displayName?.text,
      address: place.formattedAddress,
      latitude: place.location?.latitude,
      longitude: place.location?.longitude
    })) || []

  return places
}

module.exports = {
  searchPlaces
}