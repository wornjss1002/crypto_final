'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewCapsulePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    recipientEmail: '',
    content: '',
    viewDate: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 유효성 검사
    const { recipientEmail, content, viewDate } = form
    if (!recipientEmail || !content || !viewDate) {
      setError('모든 항목을 입력해주세요.')
      return
    }

    // 공개일이 과거인지 확인
    const selectedDate = new Date(viewDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      setError('공개일은 오늘 이후여야 합니다.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/capsules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include',
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message || '캡슐 발송 실패')

      router.push('/capsules')
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
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl mb-4 text-center">새 타임캡슐 보내기</h2>
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <label className="block mb-3">
          <span className="text-gray-700">받는 사람 이메일</span>
          <input
            type="email"
            name="recipientEmail"
            value={form.recipientEmail}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </label>

        <label className="block mb-3">
          <span className="text-gray-700">메시지 내용</span>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={4}
            required
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">공개일</span>
          <input
            type="date"
            name="viewDate"
            value={form.viewDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? '발송 중...' : '캡슐 발송'}
        </button>
      </form>
    </div>
  )
}
