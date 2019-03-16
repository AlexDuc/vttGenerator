import express from 'express'
import api from './api'
const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 4000

app.set('port', port)

const bodyParser = require('body-parser')

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

// Import API Routes
app.use('/api', api)

// Listen the server
app.listen(port, host, () => {
  console.log('Server listening on ' + host + ':' + port)
})
