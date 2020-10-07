import mongoose from 'mongoose'

const GallerySchema = new mongoose.Schema({
  title: String,
  description: String,
  instagramAccounts: {
    type: Array,
    required: true,
  },
  hashtags: {
    type: Array,
  },
  shop_id: String,
  status: Boolean,
  created_at: {
    type: Date,
    default: Date.now,
  },
  modified_at: Date,
})

// --- Add static methods here

GallerySchema.methods.getMedias = () => {

}

// ---


const Gallery = mongoose.model('Gallery', GallerySchema)

export {
  Gallery,
}
