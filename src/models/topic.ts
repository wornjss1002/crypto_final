import mongoose, { Schema } from 'mongoose'
const topicSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
  },
  {
    timestamps: true,
    strict: true,
  }
)
const Topic =
  mongoose.models.MYBLOG_Topic || mongoose.model('MYBLOG_Topic', topicSchema)
export default Topic
