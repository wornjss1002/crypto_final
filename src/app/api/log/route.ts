import connectMongoDB from '@/libs/mongodb'
import Log from '@/models/log'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // 이메일 존재 여부 검사
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: '유효한 이메일이 필요합니다.' },
        { status: 400 }
      )
    }

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '잘못된 이메일 형식입니다.' },
        { status: 400 }
      )
    }

    await connectMongoDB()

    await Log.create({
      email: email.trim().toLowerCase(),
      createdAt: new Date(),
    })

    return NextResponse.json(
      { message: '로그인 이벤트가 저장되었습니다.' },
      { status: 201 }
    )
  } catch (error) {
    console.error('[로그 이벤트 저장 실패]:', error)
    return NextResponse.json(
      { error: '서버 오류로 로그 저장에 실패했습니다.' },
      { status: 500 }
    )
  }
}
