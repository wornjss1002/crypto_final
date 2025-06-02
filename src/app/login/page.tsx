'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react'
import Layout from '@/components/Layout'
import { signIn } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const errorQuery = searchParams?.get('error')
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl: '/capsules',
    })

    if (result?.error) {
      setError('로그인 실패: ' + result.error)
    } else if (result?.url) {
      router.push(result.url)
    }

    setLoading(false)
  }

  return (
    <Layout title="로그인">
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">로그인</h2>

        {(errorQuery || error) && (
          <p className="text-red-600 text-center">{error || errorQuery}</p>
        )}

        <div>
          <label className="block mb-1">이메일</label>
          <input
            name="email"
            type="email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1">비밀번호</label>
          <input
            name="password"
            type="password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full text-center text-lg font-bold bg-black text-white px-3 py-1 rounded hover:bg-black/75 transition"
        >
          {loading ? '로딩 중...' : '로그인'}
        </button>
      </form>
    </Layout>
  )
}
