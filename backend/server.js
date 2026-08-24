require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY
)

app.get('/api/test', (req, res) => {
  res.json({
    message: 'Voyagio API is working'
  })
})

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})