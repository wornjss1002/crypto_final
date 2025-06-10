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
}

export default function CapsuleCard({ capsule }: CapsuleCardProps) {
  const isSent = Boolean(capsule.recipientEmail)
  return (
    <div className="border p-4 rounded-lg shadow-sm">
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
        <strong>내용:</strong> {capsule.content}
      </p>
      <p>
        <strong>공개일:</strong>{' '}
        {new Date(capsule.viewDate).toLocaleDateString()}
      </p>
      <p>
        <strong>작성일:</strong>{' '}
        {new Date(capsule.createdAt).toLocaleDateString()}
      </p>
    </div>
  )
}
