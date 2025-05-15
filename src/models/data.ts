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

if (mongoose.models.MYBLOG_Data) {
  delete mongoose.models.MYBLOG_Data
}

const Data = mongoose.model('MYBLOG_Data', topicSchema)
export default Data
