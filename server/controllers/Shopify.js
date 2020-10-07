// import cookie from 'cookie'
import crypto from 'crypto'
import querystring from 'querystring'
import request from 'request'
import { Shop, buildShopUrl } from '../models/Shop'
import ApiClient from '../libs/ApiClient'

export default class Shopify {
  constructor(req, res) {
    this.req = req
    this.res = res
  }

  install() {
    let shop = this.req.body.shop || this.req.query.shop
    if (shop) {
      shop = buildShopUrl(shop)

      const { DOMAIN, SHOPIFY_API_KEY, SHOPIFY_SCOPES } = process.env

      const redirectUri = DOMAIN + 'shopify/callback'
      const installUrl = `${shop}/admin/oauth/authorize?client_id=${SHOPIFY_API_KEY}&scope=${SHOPIFY_SCOPES}&redirect_uri=${redirectUri}`

      // this.res.cookie('state', redirectUri + Date.now())
      return this.res.json({
        url: installUrl,
      })
    } else {
      return this.res.status(400).json({
        message: 'Missing shop parameter',
      })
    }
  }

  async installCallback() {
    const { shop, hmac, code } = this.req.query
    const shopUrl = shop
    // const stateCookie = cookie.parse(this.req.headers.cookie).state;

    // if (state !== stateCookie) {
    //     return res.status(403).send('Request origin cannot be verified');
    // }

    if (shopUrl && hmac && code) {
      const map = Object.assign({}, this.req.query)
      delete map['signature']
      delete map['hmac']
      const _message = querystring.stringify(map)
      const providedHmac = Buffer.from(hmac, 'utf-8')
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

      if (!hashEquals) {
        return this.res.status(400).json({
          message: 'HMAC validation failed',
        })
      }

      // Find shop in database
      let shop = await Shop.findByShopUrl(shopUrl)

      if (!shop) {
        // Authorize new client
        shop = await this.authorize(shopUrl, code)
      }

      // Activate if returning client
      if (!shop.status) {
        await Shop.updateShop({ name: shopUrl }, { status: 1 })
      }

      // Authenticate client
      await this.authenticate(shop)

      this.res.redirect('/connect-account')
    } else {
      this.res.status(400).send({
        message: 'Required parameters missing',
      })
    }
  }

  async authorize(shopUrl, code) {
    return new Promise((resolve, reject) => {
      const accessTokenRequestUrl = 'https://' + shopUrl + '/admin/oauth/access_token'
      const accessTokenPayload = {
        client_id: process.env.SHOPIFY_API_KEY,
        client_secret: process.env.SHOPIFY_API_SECRET,
        code,
      }

      const options = {
        method: 'POST',
        url: accessTokenRequestUrl,
        body: accessTokenPayload,
        json: true,
      }

      request(options, async (err, response, body) => {
        if (err) {
          reject(err)
          return
        }

        const access_token = body.access_token

        const api = new ApiClient('POST', shopUrl)
        api.setAccessToken(access_token)
        const graphQl = `{
                    shop {
                        id
                        name
                        contactEmail
                        email
                        url
                        primaryDomain {
                        url
                        }
                    }
                }`

        const data = await api.call(graphQl)

        let shop = new Shop({
          name: data.shop.name,
          url: data.shop.url,
          contactEmail: data.shop.contactEmail,
          email: data.shop.email,
          domain: data.shop.primaryDomain.url,
          access_token: access_token,
          status: 1,
        })

        shop = await shop.save()

        await api.registerScriptTags()

        if (!shop) {
          throw new Error('Error occurred while saving shop to database')
        }

        resolve(shop)
      })
    })
  }

  async authenticate(shop) {
    this.req.session.shop = shop
    return this.req.session.shop
  }

  logout() {
    this.req.session.destroy((err) => {
      this.res.redirect('/')
    })
  }
}
