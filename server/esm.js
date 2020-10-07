const dotenv = require('dotenv')
dotenv.config({ path: './.env' })
require = require('esm')(module) // eslint-disable-line
module.exports = require('./index.js')

