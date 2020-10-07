import { Shop } from '../models/Shop'
import { InstagramAccount } from '../models/InstagramAccount'
import { Gallery } from '../models/Gallery'
import ApiClient from '../libs/ApiClient'
import FacebookService from '../libs/FacebookService'

// GraphQL resolvers
const API = (req, res) => {
  return {

    get_shop_info() {
      return req.session.shop
    },

    async create_new_gallery({ title, description, instagramAccounts, hashtags }) {
      const gallery = new Gallery({
        title,
        description,
        instagramAccounts,
        hashtags,
        status: true,
        shop_id: req.session.shop._id,
      })

      return await gallery.save()
    },

    async connect_instagram_accounts({ ids }) {
      const instagramAccounts = await InstagramAccount.find({ ig_id: ids })

      if (instagramAccounts) {
        const instagramAccountIds = []
        instagramAccounts.forEach((account) => {
          instagramAccountIds.push(account.ig_id)
        })

        await Shop.findOneAndUpdate({ _id: req.session.shop._id }, { instagram_business_account: instagramAccountIds })
        return instagramAccounts
      }

      throw new Error('Instagram accounts not found')
    },
    async get_connected_accounts() {
      return await InstagramAccount.find({ shop_id: req.session.shop._id })
    },
    async get_galleries() {
      return await Gallery.find({ shop_id: req.session.shop._id })
    },
    async get_medias({ gallery_id }) {
      // @TODO need to check if gallery belongs to current shop

      const gallery = await Gallery.findById(gallery_id)

      const fbService = new FacebookService(req, res)

      let instagramUser

      const promises = []

      if (gallery.instagramAccounts.length) {
        const instagramAccounts = await InstagramAccount.find({ ig_id: gallery.instagramAccounts }).select('instagram_id')

        instagramAccounts.forEach((account) => {
          // For searching hashtag media
          if (!instagramUser) instagramUser = account

          promises.push(fbService.getInstagramAccountMedia(account.instagram_id))
        })
      }

      if (!instagramUser) {
        instagramUser = await InstagramAccount.findOne({ shop_id: req.session.shop._id }).select('instagram_id')
      }

      gallery.hashtags.forEach((hashtag) => {
        promises.push(fbService.searchByHashtag({
          hashtag: encodeURIComponent(hashtag.replace('#', '')),
          filter: 'recent_media',
          instagramUserId: instagramUser.instagram_id,
        }))
      })

      let responses = await Promise.all(promises)

      responses = responses.map((response) => response.data)
      responses = responses.map((response) => response.data)
      let response = []

      responses.forEach((r) => {
        response = response.concat(r)
      })

      return response.map((media) => {
        media.media_id = media.id ? String(media.id) : '0'
        media.ig_id = media.ig_id ? String(media.ig_id) : '0'
        media.owner_id = media.owner ? String(media.owner.id) : '0'
        media.children = media.children ? media.children.data : []
        return media
      })

      // await InstagramMedia.insertMany(medias)

      // return await InstagramMedia.find({ gallery_id }).limit(20);
    },

    async get_themes() {
      const api = new ApiClient('GET', req.session.shop.url, 'REST')
      api.setAccessToken(req.session.shop.access_token)
      const response = await api.call('/themes.json')
      return response.themes
    },

    async get_sections({ theme_id }) {
      const api = new ApiClient('GET', req.session.shop.url, 'REST')
      api.setAccessToken(req.session.shop.access_token)
      const response = await api.call(`/themes/${theme_id}/assets.json?asset[key]=config/settings_data.json`)
      const schema = JSON.parse(response.asset.value)
      return schema.current.content_for_index
    },

    async integrate({ theme_id, section }) {
      const api = new ApiClient('GET', req.session.shop.url, 'REST')
      api.setAccessToken(req.session.shop.access_token)
      const response = await api.call(`/themes/${theme_id}/assets.json?asset[key]=config/settings_data.json`)
      const schema = JSON.parse(response.asset.value)
      const sections = schema.current.content_for_index

      sections.forEach((item, i) => {
        if (item == section) {
          schema.current.content_for_index.splice(i + 1, 0, 'nomad-gallery')
        }
      })

      api.setMethod('PUT')
      const data = {
        'asset': {
          'key': 'config/settings_data.json',
          'value': JSON.stringify(schema),
        },
      }
      const result = await api.call(`/themes/${theme_id}/assets.json`, data)
      return result || 'Need to create section first'
    },

    async searchByHashtag({ hashtag, filter }) {
      const fbService = new FacebookService(req, res)
      return await fbService.searchByHashtag(hashtag, filter)
    },

    async stories() {
      const fbService = new FacebookService(req, res)
      return await fbService.getStories()
    },

    async delete_gallery({ gallery_id }) {
      const result = await Gallery.deleteOne({ _id: gallery_id })
      return result.deletedCount
    },
  }
}

export default API
