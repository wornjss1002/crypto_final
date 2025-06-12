import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/libs/mongodb'
import CapsuleModel from '@/models/capsule'
import { getToken } from 'next-auth/jwt'
import crypto from 'crypto'
import bcrypt from 'bcrypt'

const SECRET = process.env.NEXTAUTH_SECRET!

type CapsuleType = {
  _id: string
  senderId: string
  recipientEmail: string
  content: string
  viewDate: Date
  createdAt: Date
  passwordHash?: string // 추가: 비밀번호 해시 필드 명시
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

  // 비밀번호가 설정된 캡슐이면, 쿼리스트링 또는 헤더/바디에서 password를 받아 검증
  if (capsule.passwordHash) {
    let password = ''
    // 1. 쿼리스트링에서 password 추출
    const url = new URL(request.url)
    password = url.searchParams.get('password') || ''
    // 2. (선택) body에서 password 추출 (GET은 body가 없음, POST/PUT만 가능)
    // 3. (선택) 헤더에서 password 추출
    if (!password) {
      password = request.headers.get('x-capsule-password') || ''
    }
    if (!password) {
      return NextResponse.json(
        { message: '비밀번호가 필요합니다.' },
        { status: 401 }
      )
    }
    const isMatch = await bcrypt.compare(password, capsule.passwordHash)
    if (!isMatch) {
      return NextResponse.json(
        { message: '비밀번호가 일치하지 않습니다.' },
        { status: 403 }
      )
    }
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

  // 복호화: 공개일이 도래했고, content가 암호화된 경우
  let content = capsule.content
  if (isViewable) {
    // 복호화 시도 (암호화된 경우만)
    const key = process.env.CAPSULE_AES_KEY
    const iv = process.env.CAPSULE_AES_IV
    if (key && iv) {
      try {
        const decipher = crypto.createDecipheriv(
          'aes-256-cbc',
          Buffer.from(key, 'hex'),
          Buffer.from(iv, 'hex')
        )
        let decrypted = decipher.update(content, 'base64', 'utf8')
        decrypted += decipher.final('utf8')
        content = decrypted
      } catch {
        // 복호화 실패 시 원본 content 반환
      }
    }
  }

  // content만 복호화된 값으로 교체
  const result = { ...capsule, content }
  if ('passwordHash' in result) {
    delete result.passwordHash
  }
  return NextResponse.json(result)
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
