// src/app/api/capsules/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/libs/mongodb'
import CapsuleModel from '@/models/capsule'
import { getToken } from 'next-auth/jwt'

const SECRET = process.env.NEXTAUTH_SECRET!

export async function GET(request: NextRequest) {
  // 세션 JWT 토큰 추출
  const token = await getToken({ req: request, secret: SECRET })
  if (!token) {
    return NextResponse.json({ message: '인증 필요' }, { status: 401 })
  }

  // DB 연결
  await dbConnect()

  // 나의 보낸 캡슐 조회
  const sent = await CapsuleModel.find({ senderId: token.uid })

  // 나에게 도착한 캡슐 중 공개일이 지난 것만 조회
  const now = new Date()
  const received = await CapsuleModel.find({
    recipientEmail: token.email,
    viewDate: { $lte: now },
  })

  return NextResponse.json({ sent, received })
}

export async function POST(request: NextRequest) {
  // 세션 검증
  const token = await getToken({ req: request, secret: SECRET })
  if (!token) {
    return NextResponse.json({ message: '인증 필요' }, { status: 401 })
  }

  // 요청 바디 파싱
  const { recipientEmail, content, viewDate } = await request.json()
  if (!recipientEmail || !content || !viewDate) {
    return NextResponse.json(
      { message: '모든 필드를 입력해주세요.' },
      { status: 400 }
    )
  }

  // DB 연결 및 저장
  await dbConnect()
  const capsule = await CapsuleModel.create({
    senderId: token.uid,
    recipientEmail,
    content,
    viewDate: new Date(viewDate),
    createdAt: new Date(),
  })

  return NextResponse.json(
    { message: '캡슐이 발송되었습니다.', capsule },
    { status: 201 }
  )
}
