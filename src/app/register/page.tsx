'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setError('비밀번호 확인이 일치하지 않습니다.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || '회원가입 실패')
      }
      // 회원가입 성공 후 로그인 페이지로 이동
      router.push('/login')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl mb-4 text-center">회원가입</h2>
        {error && <p className="text-red-600 mb-2 text-center">{error}</p>}

        <label className="block mb-2">
          <span className="text-gray-700">이름</span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </label>

        <label className="block mb-2">
          <span className="text-gray-700">Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </label>

        <label className="block mb-2">
          <span className="text-gray-700">Password</span>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Confirm Password</span>
          <input
            type="password"
            name="confirm"
            value={form.confirm}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          {loading ? '로딩 중...' : '회원가입'}
        </button>
      </form>
    </div>
  )
}
