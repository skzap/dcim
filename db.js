import { MongoClient } from "mongodb"

const dbUrl = 'mongodb://localhost:27017'
const dbName = 'eiffel'

let db = {
  client: null,
  db: null,
  init: async function() {
    this.client = new MongoClient(dbUrl)
    await this.client.connect()
    this.db = this.client.db(dbName)
  }
}

export default db