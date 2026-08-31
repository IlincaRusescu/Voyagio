require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')

const placesRouter = require('./routes/places')
const routesRouter = require('./routes/routes')
const aiRouter = require('./routes/ai')

const validationRoutes = require('./routes/validation')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY
)

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
)

app.use('/api/validation', validationRoutes(supabaseAdmin))

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    message: 'ok'
  })
})

// Current authenticated user
app.get('/api/me', async (req, res) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      error: 'Missing authorization token'
    })
  }

  const token = authHeader.replace('Bearer ', '')

  // Verificăm dacă token-ul aparține unui user real
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser(token)

  if (userError || !user) {
    return res.status(401).json({
      error: 'Invalid or expired token'
    })
  }

  // Cream un client Supabase care foloseste token-ul userului.
  // Astfel, RLS stie cine face request-ul.
  const userSupabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PUBLISHABLE_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    }
  )

  const {
    data: profile,
    error: profileError
  } = await userSupabase
    .from('profiles')
    .select(
      'first_name, last_name, username, country, plan, token_balance, avatar_url'
    )
    .eq('id', user.id)
    .single()

  if (profileError) {
    console.error('Profile query error:', profileError)

    return res.status(500).json({
      error: 'Could not load user profile'
    })
  }

  res.json({
    id: user.id,
    email: user.email,
    profile
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