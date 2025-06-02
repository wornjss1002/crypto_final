// src/models/User.ts
import { Schema, model, models, Document } from 'mongoose'
import { z } from 'zod'

// Zod 스키마 정의
export const UserSchema = z.object({
  name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다.'),
  email: z.string().email('유효한 이메일이어야 합니다.'),
  passwordHash: z.string(),
  // 기존 z.instanceof → z.date() 사용
  createdAt: z.date().default(() => new Date()),
})

// TS 타입 추출
export type UserType = z.infer<typeof UserSchema> & Document

// Mongoose 스키마 정의
const mongooseSchema = new Schema<UserType>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: Date, default: () => new Date() },
  },
  { timestamps: false }
)

// 이미 모델이 등록되어 있으면 재사용
const UserModel = models.User || model<UserType>('User', mongooseSchema)

export default UserModel
