import mongoose from 'mongoose'

const ShopSchema = new mongoose.Schema({
  email: String,
  contactEmail: String,
  name: {
    type: String,
    index: true,
  },
  url: {
    type: String,
    unique: true,
  },
  access_token: String,
  fb_token: {
    type: String,
    default: null,
  },
  status: Boolean,
  scopes: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
  modified_at: Date,
})


// --- Add static methods here

ShopSchema.statics.findByShopUrl = async function(url) {
  url = buildShopUrl(url)
  return this.findOne({ url: url })
}

ShopSchema.statics.updateShop = async function(findBy, newVals) {
  return await this.updateOne(findBy, { $set: newVals })
}

// ---

// Shop model creating
const Shop = mongoose.model('Shop', ShopSchema)


function buildShopUrl(shopUrl) {
  if (shopUrl.indexOf('https://') === -1) {
    shopUrl = 'https://' + shopUrl
  }

  if (shopUrl.indexOf('.myshopify.com') === -1) {
    shopUrl = shopUrl + '.myshopify.com'
  }

  return shopUrl
}

export {
  Shop,
  buildShopUrl,
}
