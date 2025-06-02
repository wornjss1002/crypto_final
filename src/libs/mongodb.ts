// src/lib/mongodb.ts
import mongoose from 'mongoose'

const rawUri = process.env.MONGODB_URI
if (!rawUri) {
  throw new Error('Please define the MONGODB_URI environment variable')
}
// rawUri가 이 시점에 string임을 보장
const MONGODB_URI: string = rawUri

let cachedConn: mongoose.Mongoose | null = null
let cachedPromise: Promise<mongoose.Mongoose> | null = null

export default async function dbConnect(): Promise<mongoose.Mongoose> {
  if (cachedConn) {
    return cachedConn
  }
  if (!cachedPromise) {
    cachedPromise = mongoose
      .connect(MONGODB_URI)
      .then((mongooseInstance) => mongooseInstance)
  }
  cachedConn = await cachedPromise
  return cachedConn
}
