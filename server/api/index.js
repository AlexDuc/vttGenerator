var router = require('express').Router()

// var html = require('./json.js')
router.use('/track', require('./track.js'))

module.exports = router
