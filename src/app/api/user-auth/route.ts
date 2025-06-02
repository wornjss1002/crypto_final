import { NextRequest, NextResponse } from 'next/server'
import connectMongoDB from '@/libs/mongodb'
import User from '@/models/user'

export async function POST(req: NextRequest) {
  try {
    const { user } = await req.json()

    if (!user?.email || !user?.name) {
      return NextResponse.json(
        { success: false, error: '이름과 이메일이 필요합니다.' },
        { status: 400 }
      )
    }

    const name = user.name.trim()
    const email = user.email.trim().toLowerCase()

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: '유효한 이메일 형식이 아닙니다.' },
        { status: 400 }
      )
    }

    await connectMongoDB()

    const existing = await User.findOne({ email })
    if (!existing) {
      await User.create({ name, email, createdAt: new Date() })
    }

    // 로그인 이벤트 기록
    const apiUrl = process.env.API_URL
    if (apiUrl) {
      try {
        await fetch(`${apiUrl}/api/log`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        })
      } catch (logErr) {
        console.warn('[로그 저장 실패]', logErr)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[OAuth 로그인 처리 실패]', error)
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
