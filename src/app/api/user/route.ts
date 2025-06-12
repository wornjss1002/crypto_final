import User from '@/models/user'
import connectMongoDB from '@/libs/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // 기본 유효성 검사
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: '이름, 이메일, 비밀번호는 필수입니다.' },
        { status: 400 }
      )
    }

    const trimmedName = name.trim()
    const trimmedEmail = email.trim().toLowerCase()
    const trimmedPassword = password.trim()

    // 이메일 형식 검사
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return NextResponse.json(
        { error: '유효하지 않은 이메일 형식입니다.' },
        { status: 400 }
      )
    }

    // 비밀번호 보안 검사
    if (
      trimmedPassword.length < 8 ||
      !/\d/.test(trimmedPassword) ||
      !/[a-zA-Z]/.test(trimmedPassword)
    ) {
      return NextResponse.json(
        { error: '비밀번호는 영문+숫자 포함 8자 이상이어야 합니다.' },
        { status: 400 }
      )
    }

    await connectMongoDB()

    // 중복 이메일 검사
    const existingUser = await User.findOne({ email: trimmedEmail })
    if (existingUser) {
      return NextResponse.json(
        { error: '이미 존재하는 이메일입니다.' },
        { status: 409 }
      )
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(trimmedPassword, 10)

    // 사용자 생성
    const user = await User.create({
      name: trimmedName,
      email: trimmedEmail,
      passwordHash: hashedPassword, // password → passwordHash
      createdAt: new Date(),
    })

    return NextResponse.json(
      { message: '회원가입 완료', user: { id: user._id, email: user.email } },
      { status: 201 }
    )
  } catch (error) {
    console.error('[회원가입 오류]', error)
    return NextResponse.json(
      { error: '서버 오류로 인해 회원가입에 실패했습니다.' },
      { status: 500 }
    )
  }
}
