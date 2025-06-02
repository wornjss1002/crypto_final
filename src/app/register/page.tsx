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

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const validatePassword = (password: string) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedForm = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password.trim(),
      confirm: form.confirm.trim(),
    }

    if (
      !trimmedForm.name ||
      !trimmedForm.email ||
      !trimmedForm.password ||
      !trimmedForm.confirm
    ) {
      setError('모든 항목을 입력해주세요.')
      return
    }

    if (!validateEmail(trimmedForm.email)) {
      setError('유효한 이메일을 입력해주세요.')
      return
    }

    if (!validatePassword(trimmedForm.password)) {
      setError('비밀번호는 8자 이상이며 영문과 숫자를 포함해야 합니다.')
      return
    }

    if (trimmedForm.password !== trimmedForm.confirm) {
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
          name: trimmedForm.name,
          email: trimmedForm.email,
          password: trimmedForm.password,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || '회원가입 실패')
      }

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
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </label>

        <label className="block mb-2">
          <span className="text-gray-700">이메일</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </label>

        <label className="block mb-2">
          <span className="text-gray-700">비밀번호</span>
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            placeholder="영문+숫자 포함 8자 이상"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">비밀번호 확인</span>
          <input
            type="password"
            name="confirm"
            autoComplete="new-password"
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
