// src/models/capsule.ts
import { Schema, model, models, Document } from 'mongoose'
import { z } from 'zod'

// 1) Zod 스키마 정의
export const CapsuleSchema = z.object({
  senderId: z.string(),
  recipientEmail: z.string().email('유효한 이메일이어야 합니다.'),
  content: z.string().min(1, '내용을 입력해주세요.'),
  viewDate: z.date(),
  createdAt: z.date().default(() => new Date()),
})
export type CapsuleType = z.infer<typeof CapsuleSchema> & Document

// 2) Mongoose 스키마 정의
const mongooseSchema = new Schema<CapsuleType>(
  {
    senderId: { type: String, required: true, index: true },
    recipientEmail: { type: String, required: true, index: true },
    content: { type: String, required: true },
    viewDate: { type: Date, required: true },
    createdAt: { type: Date, default: () => new Date() },
  },
  {
    collection: 'capsules',
    timestamps: false,
  }
)

// 3) 모델 생성 및 재사용
const CapsuleModel =
  models.Capsule || model<CapsuleType>('Capsule', mongooseSchema)
export default CapsuleModel

// Capsule 스키마에서 content(내용)는 평문(암호화X)으로 저장되고 있습니다.
// 암호화/복호화 로직이 없으므로 DB에는 암호화되어 저장되지 않습니다.

// senderId는 CapsuleSchema 및 Mongoose 스키마에서 string 타입으로 정의되어 있습니다.
// 실제 저장 예시: senderId: '보내는사람의_이메일' 또는 '유저의_고유ID' 등 string 값
