const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 3000

app.use(cors())

app.get('/api/test', (req, res) => {
  res.json({
    message: 'Voyagio API is working'
  })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})