import mongoose from 'mongoose'

const InstagramMediaSchema = new mongoose.Schema({
  ig_id: {
    type: String, index: true,
  },
  caption: String,
  media_id: {
    type: String,
    index: true,
  },
  like_count: Number,
  media_type: String,
  media_url: String,
  owner_id: String,
  permalink: String,
  shortcode: String,
  username: String,
  thumbnail_url: String,
  hashtag: { type: String, default: null },
  marked_ig_account_id: { type: String, default: null },
  media_group: { type: String, default: null }, // хештег, сторис, или просто публикации аккаунта и тд
})

// --- Add static methods here


// ---


const InstagramMedia = mongoose.model('InstagramMedia', InstagramMediaSchema)

export {
  InstagramMedia,
}
