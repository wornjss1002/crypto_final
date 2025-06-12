// src/app/api/capsules/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/libs/mongodb'
import CapsuleModel from '@/models/capsule'
import { getToken } from 'next-auth/jwt'
import crypto from 'crypto'
import bcrypt from 'bcrypt'

const SECRET = process.env.NEXTAUTH_SECRET!

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: SECRET })
  if (!token || !token.id || !token.email) {
    return NextResponse.json({ message: '인증 필요' }, { status: 401 })
  }

  try {
    await dbConnect()

    const sent = await CapsuleModel.find({ senderId: token.id })

    // 모든 받은 캡슐을 반환 (공개일 조건 제거)
    const received = await CapsuleModel.find({
      recipientEmail: token.email,
    })

    return NextResponse.json({ sent, received })
  } catch (error) {
    console.error('캡슐 조회 오류:', error)
    return NextResponse.json({ message: '서버 오류' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token || !token.id || !token.email) {
    return NextResponse.json({ message: '인증 필요' }, { status: 401 })
  }

  try {
    const { recipientEmail, content, viewDate, password } = await request.json()

    if (!recipientEmail || !content || !viewDate) {
      return NextResponse.json(
        { message: '모든 필드를 입력해주세요.' },
        { status: 400 }
      )
    }

    await dbConnect()

    // AES 암호화: 공개일이 아직 도래하지 않은 경우만
    const viewDateObj = new Date(viewDate)
    const now = new Date()
    let contentToSave = content
    let isEncrypted = false

    if (viewDateObj > now) {
      // 암호화 키/IV는 환경변수에서 가져옴 (없으면 에러)
      const key = process.env.CAPSULE_AES_KEY
      const iv = process.env.CAPSULE_AES_IV
      if (!key || !iv) {
        return NextResponse.json(
          { message: '서버 암호화 설정 오류' },
          { status: 500 }
        )
      }
      const cipher = crypto.createCipheriv(
        'aes-256-cbc',
        Buffer.from(key, 'hex'),
        Buffer.from(iv, 'hex')
      )
      let encrypted = cipher.update(content, 'utf8', 'base64')
      encrypted += cipher.final('base64')
      contentToSave = encrypted
      isEncrypted = true
    }

    // 비밀번호 해시 처리 (없으면 undefined)
    let passwordHash: string | undefined = undefined
    if (password && typeof password === 'string' && password.length > 0) {
      passwordHash = await bcrypt.hash(password, 10)
    }
    console.log('password:', password, 'passwordHash:', passwordHash) // 반드시 로그 확인

    const capsule = await CapsuleModel.create({
      senderId: token.id,
      recipientEmail,
      content: contentToSave,
      viewDate: viewDateObj,
      createdAt: new Date(),
      isEncrypted,
      passwordHash: passwordHash ?? null, // undefined 대신 null로 명시
    })

    // 생성 후 실제 DB에 저장된 값 로그
    const saved = await CapsuleModel.findById(capsule._id).lean()
    console.log('DB saved capsule:', saved)

    // passwordHash를 응답에서 제거
    const capsuleObj = capsule.toObject ? capsule.toObject() : capsule
    if ('passwordHash' in capsuleObj) {
      delete capsuleObj.passwordHash
    }

    return NextResponse.json(
      { message: '캡슐이 발송되었습니다.', capsule: capsuleObj },
      { status: 201 }
    )
  } catch (error) {
    console.error('캡슐 저장 오류:', error)
    return NextResponse.json({ message: '서버 오류' }, { status: 500 })
  }
}
