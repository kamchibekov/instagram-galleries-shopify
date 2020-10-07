import mongoose from 'mongoose'

const InstagramAccountSchema = new mongoose.Schema({
  name: String,
  username: {
    type: String,
    index: true,
    unique: true,
  },
  profile_picture_url: String,
  media_count: Number,
  followers_count: Number,
  follows_count: Number,
  instagram_id: String,
  ig_id: String,
  shop_id: String,
})

// --- Add static methods here


// ---

const InstagramAccount = mongoose.model('InstagramAccount', InstagramAccountSchema)

export {
  InstagramAccount,
}
