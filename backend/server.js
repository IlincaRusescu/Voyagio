require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')

const placesRouter = require('./routes/places')
const routesRouter = require('./routes/routes')
const aiRouter = require('./routes/ai')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY
)

// Test backend
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Voyagio API is working'
  })
})

// Test authenticated user
app.get('/api/me', async (req, res) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      error: 'Missing authorization token'
    })
  }

  const token = authHeader.replace('Bearer ', '')

  const {
    data: { user },
    error
  } = await supabase.auth.getUser(token)

  if (error || !user) {
    return res.status(401).json({
      error: 'Invalid or expired token'
    })
  }

  res.json({
    id: user.id,
    email: user.email
  })
})

// Validate destination with Geoapify
app.post('/api/locations/validate', async (req, res) => {
  const { city, countryCode } = req.body

  if (!city || !countryCode) {
    return res.status(400).json({
      error: 'City and country are required'
    })
  }

  try {
    const params = new URLSearchParams({
      text: city,
      filter: `countrycode:${countryCode.toLowerCase()}`,
      type: 'city',
      format: 'json',
      limit: '5',
      apiKey: process.env.GEOAPIFY_API_KEY
    })

    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/search?${params}`
    )

    if (!response.ok) {
      throw new Error('Geoapify request failed')
    }

    const results = await response.json()

    const matchingCity = results.results?.find((result) => {
      const resultCity =
        result.city ||
        result.town ||
        result.village ||
        result.municipality

      return (
        resultCity &&
        resultCity.toLowerCase() === city.trim().toLowerCase()
      )
    })

    if (!matchingCity) {
      return res.json({
        valid: false
      })
    }

    return res.json({
      valid: true,
      destination: {
        city:
          matchingCity.city ||
          matchingCity.town ||
          matchingCity.village ||
          matchingCity.municipality,
        country: matchingCity.country,
        countryCode: matchingCity.country_code?.toUpperCase()
      }
    })
  } catch (error) {
    console.error('Location validation error:', error)

    return res.status(500).json({
      error: 'Could not validate destination'
    })
  }
})

// Google Places routes
app.use('/api/places', placesRouter)
app.use('/api/routes', routesRouter)
app.use('/api/ai', aiRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})