import axios from 'axios'
import crypto from 'crypto'
import { Shop } from '../models/Shop'

const isAuthenticated = async (req, res, next) => {
  if (req.session.shop) {
    return next()
  }

  // If url from shopify proxy then authenticate it
  if (req.query.signature && req.query.shop) {
    const parameters = []
    for (const key in req.query) {
      if (key != 'signature') {
        parameters.push(key + '=' + req.query[key])
      }
    }
    const _message = parameters.sort().join('')
    const providedHmac = Buffer.from(req.query.signature, 'utf-8')
    const generatedHash = Buffer.from(
      crypto
        .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
        .update(_message)
        .digest('hex'),
      'utf-8',
    )
    let hashEquals
    // timingSafeEqual will prevent any timing attacks. Arguments must be buffers
    try {
      hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
      // timingSafeEqual will return an error if the input buffers are not the same length.
    } catch (e) {
      hashEquals = false
    }

    if (hashEquals) {
      const shop = await Shop.findByShopUrl(req.query.shop)

      if (shop) {
        req.session.shop = shop
        return next()
      }
    }
  }

  return res.status(403).redirect('/')
}

const print_t = async (message) => {
  const BOT_ID = '903708315:AAHskYEdPzJiDH1YnpYZqLfdPMWpU6HnTmc'
  const CHANNEL_ID = '@nomaddev' // private channel -1001245430130

  if (typeof message === 'object') {
    try {
      message = JSON.stringify(message)
    } catch {
      // silence is golden
    }
  }

  const URL = `https://api.telegram.org/bot${BOT_ID}/sendMessage?chat_id=${CHANNEL_ID}&text=\`\`\`${message}\`\`\``

  return axios.get(URL, { json: true })
}


export {
  isAuthenticated,
  print_t,
}
