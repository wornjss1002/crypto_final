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

// 아래에 DELETE 핸들러 추가
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const token = await getToken({ req: request, secret: SECRET })
  if (!token) {
    return NextResponse.json({ message: '인증 필요' }, { status: 401 })
  }

  await dbConnect()

  // 캡슐 소유자만 삭제 가능
  const capsule = await CapsuleModel.findById(id)
  if (!capsule) {
    return NextResponse.json(
      { message: '캡슐을 찾을 수 없습니다.' },
      { status: 404 }
    )
  }
  // senderId는 string, token.id도 string
  if (capsule.senderId !== token.id) {
    return NextResponse.json(
      { message: '삭제 권한이 없습니다.' },
      { status: 403 }
    )
  }

  await CapsuleModel.deleteOne({ _id: id })

  return NextResponse.json({ message: '삭제 완료' }, { status: 200 })
}
