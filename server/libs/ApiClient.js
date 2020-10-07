import request from 'request'
import { buildShopUrl } from '../models/Shop'

export default class ApiClient {
  constructor(method = 'POST', shop, queryType = 'graphql') {
    this.method = method
    this.queryType = queryType
    shop = buildShopUrl(shop)
    this.apiUrl = `${shop}/admin/api/2020-04`
    this.graphqlUrl = `${shop}/admin/api/2020-04/graphql.json`
  }

  setAccessToken(accessToken) {
    this.accessToken = accessToken
  }

  setQueryType(queryType = 'graphql') {
    this.queryType = queryType
  }

  setMethod(method) {
    this.method = method
  }

  graphqlCall(graphql) {
    return new Promise((resolve, reject) => {
      const options = {
        method: this.method,
        url: this.graphqlUrl,
        headers: {
          'x-shopify-access-token': this.accessToken,
          'content-type': 'application/graphql',
        },
        body: graphql,
      }

      request(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          try {
            const parsedData = JSON.parse(body)
            resolve(parsedData.data)
          } catch (e) {
            reject(e)
          }
        } else {
          reject(error || response)
        }
      })
    })
  }

  apiCall(query, data) {
    return new Promise((resolve, reject) => {
      const options = {
        method: this.method,
        url: this.apiUrl + query,
        headers: {
          'Content-Type': 'application/json',
          'x-shopify-access-token': this.accessToken,
        },
        json: true,
      }

      if (data) {
        options.body = data
      }

      request(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          resolve(body)
        } else {
          reject(error || response)
        }
      })
    })
  }

  async call(query, data) {
    if (this.queryType === 'graphql') {
      return this.graphqlCall(query)
    } else {
      return this.apiCall(query, data)
    }
  }

  async registerScriptTags() {
    return await this.apiCall('/script_tags.json', {
      'script_tag': {
        'event': 'onload',
        'src': 'https://nomaddev.cf/integrator.js',
      },
    })
  }
}
