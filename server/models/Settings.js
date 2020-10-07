import mongoose from 'mongoose'


const SettingsSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true,
    unique: true,
  },
  value: String,
  shop_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Shop',
  },
})

// --- Add static methods here

SettingsSchema.statics.getSetting = async function(shop_id, name) {
  return await this.findOne({ shop_id, name })
}

SettingsSchema.statics.setSetting = async function(shop_id, name, value) {
  return await this.findOneAndUpdate(
    { shop_id, name },
    { value },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  )
}

// ---


const Settings = mongoose.model('Settings', SettingsSchema)


export {
  Settings,
}
