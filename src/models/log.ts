import mongoose, { Schema } from 'mongoose'
const logSchema = new Schema(
  {
    email: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)
const Log =
  mongoose.models.MYBLOG_Log || mongoose.model('MYBLOG_Log', logSchema)
export default Log
