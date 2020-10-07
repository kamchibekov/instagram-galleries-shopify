import express from 'express'
import FbService from '../libs/FacebookService'
import Shopify from '../controllers/Shopify'
import App from '../controllers/App'
import fs from 'fs'
import { buildSchema } from 'graphql'
import graphqlHTTP from 'express-graphql'
import API from '../graphql/api'
import { isAuthenticated } from '../libs/helpers'

const router = new express.Router()
// GraphQL schema
const schemaSource = fs.readFileSync(__dirname + '/../graphql/schema.graphql')
const schema = buildSchema(schemaSource.toString())
// GraphQL API
router.use('/graphql', isAuthenticated, graphqlHTTP((req, res) => ({
  schema: schema,
  rootValue: new API(req, res),
  graphiql: true,
})))

router.get('/', (req, res) => (new App(req, res)).index())

router.get('/privacy', (req, res) => (new App(req, res)).privacy())

router.get('/shopify/install', (req, res) => (new Shopify(req, res)).install())

router.get('/shopify/callback', (req, res) => (new Shopify(req, res)).installCallback())

router.get('/connect-account', isAuthenticated, (req, res) => (new App(req, res)).index())

router.get('/new-gallery', isAuthenticated, (req, res) => (new App(req, res)).index())

router.get('/logout', isAuthenticated, (req, res) => (new App(req, res)).logout())

router.get('/dashboard', isAuthenticated, (req, res) => (new App(req, res)).index())

router.get('/shopify/logout', isAuthenticated, (req, res) => ((new Shopify(req, res)).logout()))

router.get('/fb/auth', isAuthenticated, (req, res) => (new FbService(req, res)).fbAuthPath())

router.get('/fb/callback', isAuthenticated, (req, res) => (new FbService(req, res)).fbCallBack())

router.get('/instagram/hashtag-media', isAuthenticated, (req, res) => (new FbService(req, res)).searchByHashtag())


export default router
