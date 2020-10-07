import { Shop } from '../models/Shop'
import { InstagramAccount } from '../models/InstagramAccount'
import axios from 'axios'
// ссылка для проверок токенов
// https://developers.facebook.com/tools/debug/accesstoken
export default class FacebookService {
  constructor(req, res) {
    this.req = req
    this.res = res
    this.FbGraphUrl = process.env.FB_GRAPH_URL
    this.graphApiVersion = process.env.FB_GRAPH_VERSION
    this.fbApiUrl = this.FbGraphUrl + this.graphApiVersion
  }

  fbAuthPath() {
    // ссылка получения кода для токена
    this.res.json({
      url: `https://www.facebook.com/${this.graphApiVersion}/dialog/oauth?client_id=${process.env.FB_API_KEY}&redirect_uri=${process.env.FB_CALLBACK}&state={"{st=kartoshka,ds=travesidelkuznechik}"}&scope=${process.env.FB_SCOPES}`,
    })
  }

  async fbCallBack() {
    // берем код который приходит с facebook auth и передаем ее для получение токена user
    const code = this.req.query.code
    //  берем текущий шоп из бд и записываем фб токен туда как fbUserToken

    // получение token подтверждения
    const accessTokenUrl = `${this.FbGraphUrl}${this.graphApiVersion}/oauth/access_token?client_id=${process.env.FB_API_KEY}&redirect_uri=${process.env.FB_CALLBACK}&client_secret=${process.env.FB_API_SECRET}&code=${code}`
    const response = await axios.get(accessTokenUrl)
    const access_token = response.data.access_token

    Shop.updateShop({ _id: this.req.session.shop._id }, { fb_token: access_token })
      .then((shop) => {
        this.req.session.shop.fb_token = access_token
        return this.getFacebookPages(access_token)
      })
      .then((pages) => this.getInstagramAccount(pages))
      .then((IgAccounts) => this.saveInstagramAccounts(IgAccounts))
      .then((IGAccounts) => {
        const accounts = {
          fbAccount: this.fbAccount,
          instagramAccounts: IGAccounts,
        }
        this.res.send(`<script> window.opener.postMessage(${JSON.stringify(accounts)});window.close(); </script>`)
      }).catch((error) => {
        this.res.json(error)
      })
  }

  async saveInstagramAccounts(IgAccounts) {
    const allIgAccounts = []
    const newAccounts = []
    for (const account of IgAccounts) {
      const IgAccount = await InstagramAccount.findOne({ username: account.username })

      if (!IgAccount) {
        account.instagram_id = account.id
        account.shop_id = this.req.session.shop._id
        newAccounts.push(account)
        allIgAccounts.push(account)
      } else {
        allIgAccounts.push(IgAccount)
      }
    }
    await InstagramAccount.insertMany(newAccounts, { ordered: false })
    return allIgAccounts
  }

  async getFacebookPages(access_token) {
    const facebookUserInfoUrl = `${this.FbGraphUrl}${this.graphApiVersion}/me?fields=id,name,picture{url},accounts{id,name,picture{url},access_token,instagram_business_account}&access_token=${access_token}`
    const response = await axios.get(facebookUserInfoUrl)
    const data = response.data

    // facbook user info
    this.fbAccount = {
      id: data.id,
      name: data.name,
      picture: data.picture,
    }

    const pages = []

    // user's pages
    if (data.accounts && data.accounts.data) {
      // pulling only first page need @TODO pagination
      data.accounts.data.forEach((page) => {
        if (!page.instagram_business_account) return

        pages.push({
          id: page.id,
          name: page.name,
          picture: page.picture.data.url,
          instagram_business_account: page.instagram_business_account.id,
          access_token: page.access_token,
          shop_id: this.req.session.shop._id,
        })
      })
    }

    return pages
  }

  async getInstagramAccount(pages) {
    const fields = 'name,username,profile_picture_url,media_count,followers_count,follows_count,ig_id,id'

    // get instagram account of each page
    const promises = pages.map((page) => {
      const instagramAccountsUrl = `${this.FbGraphUrl}${this.graphApiVersion}/${page.instagram_business_account}?fields=${fields}&access_token=${page.access_token}`
      return axios.get(instagramAccountsUrl)
    })

    const responses = await Promise.all(promises)

    return responses.map((response) => response.data)
  }

  async getInstagramAccountMedia(instagramAccountId) {
    const fields = 'caption,id,like_count,media_type,media_url,owner,permalink,shortcode,username,ig_id,thumbnail_url,children{id,media_type,media_url,permalink,timestamp,thumbnail_url}'

    const url = `${this.fbApiUrl}/${instagramAccountId}/media`
    return axios.get(url,
      {
        params: {
          fields: fields,
          access_token: this.req.session.shop.fb_token,
        },
      })
  }

  // поиск по хештегу инстаграм
  async searchByHashtag(args) {
    const { hashtag, filter, instagramUserId } = args

    // top_media = получить самые популярные фото и видео, имеющие определенный хэштег
    // recent_media = получить самые последние опубликованные фото и видео, имеющие определенный хэштег
    if (hashtag && (filter === 'top_media' || filter === 'recent_media')) {
      const sessionShop = this.req.session.shop

      const hashtagIdUrl = `${this.fbApiUrl}/ig_hashtag_search?user_id=${instagramUserId}&q=${hashtag}&access_token=${sessionShop.fb_token}`
      const response = await axios.get(hashtagIdUrl)
      // axios возвращает данные в переменной data и graphql тоже итого 2 переменных data - это че за фигня!?)

      // @TODO здесь всегда в нулевой есть id? всегда ли есть id хештега которую ищем? над чекнуть
      const hashtagId = response.data.data[0].id

      // получение медия по хештегу
      const fields = 'media_type,media_url,like_count,permalink,caption,id,children{id,media_type,media_url,permalink,timestamp,thumbnail_url}'
      const hashtagApiUrl = `${this.fbApiUrl}/${hashtagId}/${filter}?user_id=${instagramUserId}&access_token=${sessionShop.fb_token}&fields=${fields}`
      return axios.get(hashtagApiUrl)

      // let hashtagMedias = this.initializeMediaData(instagramUserId, hashtag, response.data.data);

      // if (response.data.paging) {
      //     response = await axios.get(response.data.paging.next)
      //     hashtagMedias.concat(this.initializeMediaData(instagramUserId, hashtag, response.data.data))
      // }

      // return hashtagMedias
    }
    return null
  }

  async getStories() {
    const sessionShop = this.req.session.shop
    const instagramAccount = await InstagramAccount.findOne({ shop_id: sessionShop._id })
    const instagramUserId = instagramAccount.instagram_id
    const storiesListUrl = `${this.fbApiUrl}/${instagramUserId}/stories?fields=id,username,media_url,like_count,media_type,owner_id,permalink,caption&access_token=${sessionShop.fb_token}`
    const response = await axios.get(storiesListUrl)
    return await this.initializeMediaData(instagramUserId, null, response.data.data, 'stories')
  }

  // заполнение instagramMedia данных вывод json
  initializeMediaData(userId, hashtag, medias, media_group = null) {
    const listMedia = []
    for (const media of medias) {
      if (media.media_url) {
        listMedia.push({
          ig_id: userId,
          caption: media.caption,
          media_id: String(media.id),
          like_count: media.like_count,
          media_type: media.media_type,
          media_url: media.media_url,
          permalink: media.permalink,
          timestamp: media.timestamp,
          owner_id: null, // не выдает
          shortcode: null, // не выдает
          username: null, // не выдает
          thumbnail_url: null, // не выдает
          marked_ig_account_id: null, // не выдает
          media_group: media_group,
        })
      }
    }

    return listMedia
  }
}
