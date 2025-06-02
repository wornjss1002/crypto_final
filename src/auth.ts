import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import type { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          const apiUrl = process.env.API_URL || ''
          const res = await fetch(`${apiUrl}/api/user-auth`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user, account }),
          })
          return res.ok
        } catch (error) {
          console.error('[Auth Callback Error]', error)
          return false
        }
      }
      return true
    },
  },
}

export const { auth, signIn, signOut } = NextAuth(authOptions)
