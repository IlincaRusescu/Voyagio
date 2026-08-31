const express = require('express')

const router = express.Router()

module.exports = (supabase) => {
  router.get('/username', async (req, res) => {
    const username = req.query.username?.trim()

    if (!username) {
      return res.status(400).json({
        error: 'Username is required'
      })
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .maybeSingle()

    if (error) {
      console.error('Username check error:', error)

      return res.status(500).json({
        error: 'Could not check username'
      })
    }

    return res.json({
      available: !data
    })
  })

  return router
}