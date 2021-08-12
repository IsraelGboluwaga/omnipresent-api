import bluebird from 'bluebird'
import mongoose from 'mongoose'

mongoose.Promise = bluebird
mongoose.connect(process.env.TEST_DATABASE_URL || 'mongodb://localhost:27017/omnipresent-test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})

export { mongoose }
