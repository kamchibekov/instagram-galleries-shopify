import EventEmitter from 'events'
import mongoose from 'mongoose'

class Db extends EventEmitter {
  constructor() {
    super()
    if (!this.db) {
      mongoose.connect(process.env.DB_URL,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
      this.db = mongoose.connection
      this.db.on('error', console.error.bind(console, 'connection error:'))
      this.db.once('open', () => {
        this.emit('connected')
      })
    }
  }

  close() {
    this.db.close()
  }
}

export default new Db()
