import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/libs/mongodb'
import CapsuleModel from '@/models/capsule'
import { getToken } from 'next-auth/jwt'

const SECRET = process.env.NEXTAUTH_SECRET!

type CapsuleType = {
  _id: string
  senderId: string
  recipientEmail: string
  content: string
  viewDate: Date
  createdAt: Date
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const token = await getToken({ req: request, secret: SECRET })
  if (!token) {
    return NextResponse.json({ message: '인증 필요' }, { status: 401 })
  }

  await dbConnect()

  const capsule = await CapsuleModel.findById(id).lean<CapsuleType>()
  if (!capsule) {
    return NextResponse.json(
      { message: '캡슐을 찾을 수 없습니다.' },
      { status: 404 }
    )
  }

  const now = new Date()
  const isOwner = capsule.senderId === token.uid
  const isRecipient = capsule.recipientEmail === token.email
  const isViewable = capsule.viewDate <= now

  if (!isOwner && !isRecipient && !isViewable) {
    return NextResponse.json(
      { message: '아직 공개일이 아닙니다.' },
      { status: 403 }
    )
  }

  return NextResponse.json(capsule)
}
