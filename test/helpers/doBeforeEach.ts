import { mongoose } from './dbSetup'

const doBeforeEach = (done: () => any) => {
  mongoose.connection.collections.queues.drop(() => {
    done()
  })
}

export { doBeforeEach }
