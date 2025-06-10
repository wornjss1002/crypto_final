// src/app/api/capsules/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/libs/mongodb'
import CapsuleModel from '@/models/capsule'
import { getToken } from 'next-auth/jwt'

const SECRET = process.env.NEXTAUTH_SECRET!

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: SECRET });
  if (!token || !token.id || !token.email) {
    return NextResponse.json({ message: '인증 필요' }, { status: 401 })
  }

  try {
    await dbConnect()

    const sent = await CapsuleModel.find({ senderId: token.id })

    const now = new Date()
    const received = await CapsuleModel.find({
      recipientEmail: token.email,
      viewDate: { $lte: now },
    })

    return NextResponse.json({ sent, received })
  } catch (error) {
    console.error('캡슐 조회 오류:', error)
    return NextResponse.json({ message: '서버 오류' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token || !token.id || !token.email) {
    return NextResponse.json({ message: '인증 필요' }, { status: 401 })
  }

  try {
    const { recipientEmail, content, viewDate } = await request.json()

    if (!recipientEmail || !content || !viewDate) {
      return NextResponse.json(
        { message: '모든 필드를 입력해주세요.' },
        { status: 400 }
      )
    }

    await dbConnect()

    const capsule = await CapsuleModel.create({
      senderId: token.id,
      recipientEmail,
      content,
      viewDate: new Date(viewDate),
      createdAt: new Date(),
    })

    return NextResponse.json(
      { message: '캡슐이 발송되었습니다.', capsule },
      { status: 201 }
    )
  } catch (error) {
    console.error('캡슐 저장 오류:', error)
    return NextResponse.json({ message: '서버 오류' }, { status: 500 })
  }
}
