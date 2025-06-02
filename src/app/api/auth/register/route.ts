import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/libs/mongodb'
import UserModel from '@/models/user'
import { hashPassword } from '@/libs/auth'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: '모든 필드를 입력해주세요.' },
        { status: 400 }
      )
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: '유효한 이메일 형식이 아닙니다.' },
        { status: 400 }
      )
    }

    // 비밀번호 형식 검증
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          success: false,
          error: '비밀번호는 8자 이상이며 영문과 숫자를 포함해야 합니다.',
        },
        { status: 400 }
      )
    }

    await dbConnect()

    // 이메일 중복 확인
    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: '이미 등록된 이메일입니다.' },
        { status: 400 }
      )
    }

    // 비밀번호 해시화
    const passwordHash = await hashPassword(password)

    // 사용자 생성
    await UserModel.create({
      name,
      email,
      passwordHash,
      createdAt: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[회원가입 처리 실패]', error)
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
