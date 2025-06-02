// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import dbConnect from '@/libs/mongodb'
import UserModel from '@/models/user'
import { verifyPassword } from '@/libs/auth'


const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect()
        if (!credentials?.email || !credentials.password) {
          throw new Error('이메일과 비밀번호를 입력해주세요.')
        }

        const user = await UserModel.findOne({ email: credentials.email })
        if (!user) throw new Error('사용자를 찾을 수 없습니다.')

        const isValid = await verifyPassword(
          credentials.password,
          user.passwordHash
        )
        if (!isValid) throw new Error('비밀번호가 일치하지 않습니다.')

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          uid: user.id,
          email: user.email,
        }
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: (token as any).uid,
          email: (token as any).email,
        },
      }
    },
  },
  pages: {
    signIn: '/login',
    error: '/login?error',
  },
})

export { default as GET, default as POST } from '@/auth'


