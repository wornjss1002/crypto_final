'use client'
import React, { useState } from 'react'

export interface Capsule {
  _id: string
  senderId?: string
  recipientEmail?: string
  content: string
  viewDate: string
  createdAt: string
  isEncrypted?: boolean
  passwordHash?: string // 제거 (노출 금지)
}

interface CapsuleCardProps {
  capsule: Capsule
  deleteButton?: React.ReactNode
  replyButton?: React.ReactNode
  showReply?: boolean
}

export default function CapsuleCard({
  capsule,
  deleteButton,
  replyButton,
  showReply,
}: CapsuleCardProps) {
  const isSent = Boolean(capsule.recipientEmail)
  const now = new Date()
  const viewDate = new Date(capsule.viewDate)
  const isViewable = viewDate <= now

  // 비밀번호 입력 관련 상태
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [password, setPassword] = useState('')
  const [content, setContent] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // 공개일까지 남은 시간 계산
  let remainMsg = ''
  if (!isViewable) {
    const diffMs = viewDate.getTime() - now.getTime()
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60))
    remainMsg = `공개까지 ${diffHours}시간 남음`
  }

  // 비밀번호 검증 및 내용 fetch
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      // GET /api/capsules/[id]?password=...
      const res = await fetch(
        `/api/capsules/${capsule._id}?password=${encodeURIComponent(password)}`
      )
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || '오류가 발생했습니다.')
        setLoading(false)
        return
      }
      setContent(data.content)
      setShowPasswordForm(false)
    } catch {
      setError('네트워크 오류')
    }
    setLoading(false)
  }

  return (
    <div className="border p-4 rounded-lg shadow-sm relative">
      {deleteButton && (
        <div className="absolute top-2 right-2 z-10">{deleteButton}</div>
      )}
      {isSent ? (
        <p>
          <strong>받는 사람:</strong> {capsule.recipientEmail}
        </p>
      ) : (
        <p>
          <strong>보낸 사람:</strong> {capsule.senderId}
        </p>
      )}
      {/* 내용 영역 */}
      <div>
        <strong>내용:</strong>{' '}
        {!isViewable ? (
          <span className="text-gray-400 italic">공개 전입니다.</span>
        ) : content !== null ? (
          content
        ) : capsule.content === '' ? (
          <>
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              onClick={() => setShowPasswordForm((v) => !v)}
            >
              내용 보기
            </button>
            {showPasswordForm && (
              <form
                onSubmit={handlePasswordSubmit}
                className="mt-2 flex flex-col gap-2"
              >
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border rounded p-1"
                  placeholder="비밀번호 입력"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? '확인 중...' : '확인'}
                </button>
                {error && <span className="text-red-500">{error}</span>}
              </form>
            )}
          </>
        ) : (
          capsule.content
        )}
      </div>
      <p>
        <strong>공개일:</strong> {viewDate.toLocaleDateString()}
        {!isViewable && (
          <span className="ml-2 text-blue-600 font-semibold">{remainMsg}</span>
        )}
      </p>
      <p>
        <strong>작성일:</strong>{' '}
        {new Date(capsule.createdAt).toLocaleDateString()}
      </p>
      {/* 답장 버튼/폼: 받은 캡슐이고 공개된 경우만 */}
      {showReply && isViewable && <div className="mt-4">{replyButton}</div>}
    </div>
  )
}
