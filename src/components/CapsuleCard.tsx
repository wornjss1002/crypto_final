'use client'
import React from 'react'

export interface Capsule {
  _id: string
  senderId?: string
  recipientEmail?: string
  content: string
  viewDate: string
  createdAt: string
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

  // 공개일까지 남은 시간 계산
  let remainMsg = ''
  if (!isViewable) {
    const diffMs = viewDate.getTime() - now.getTime()
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60))
    remainMsg = `공개까지 ${diffHours}시간 남음`
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
      <p>
        <strong>내용:</strong>{' '}
        {isViewable ? (
          capsule.content
        ) : (
          <span className="text-gray-400 italic">공개 전입니다.</span>
        )}
      </p>
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
