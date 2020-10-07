import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import router from './config/routes'
import Db from './config/Db'
import * as Sentry from '@sentry/node'
import { Liquid } from 'liquidjs'

if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN })
}

const app = express()
const engine = new Liquid()

// custom filter for liquid js template engine. Need to make a separate file
engine.registerFilter('json', (v) => JSON.stringify(v))

app.engine('liquid', engine.express())
app.set('views', './server/views')
app.set('view engine', 'liquid')

app.use(express.static('dist/public'))

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  )
  next()
})
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(session({
  secret: process.env.SHOPIFY_API_KEY,
  cookie: {},
}))

app.use('/', router)

Db.on('connected', () => {
  const port = process.env.PORT || 3000
  app.listen(port, () => {
    console.log(`\n server started listening at port: ${port}`)
  })
})
