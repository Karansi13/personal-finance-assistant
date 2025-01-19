import { MongoClient, MongoClientOptions } from "mongodb"

if (process.env.NEXT_PUBLIC_MONGODB_URI || '') {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.NEXT_PUBLIC_MONGODB_URI || ''
const options: MongoClientOptions = {}

let client
let clientPromise: Promise<MongoClient>

  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options)
    if (client) {
      (global as any)._mongoClientPromise = client.connect()
    } else {
      throw new Error('Failed to create MongoClient')
    }
  clientPromise = (global as any)._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise

