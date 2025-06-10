'use client'
import React, { useTransition, useState } from 'react'
import CapsuleCard, { Capsule } from '@/components/CapsuleCard'
import { useRouter } from 'next/navigation'

interface SentCapsulesClientProps {
  initialSent: Capsule[]
}

export default function SentCapsulesClient({
  initialSent,
}: SentCapsulesClientProps) {
  const [sent, setSent] = useState(initialSent)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    try {
      const res = await fetch(`/api/capsules/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('삭제 실패')
      setSent((prev) => prev.filter((c) => c._id !== id))
      startTransition(() => {
        router.refresh()
      })
    } catch (e) {
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">내가 보낸 캡슐</h1>
      {sent.length > 0 ? (
        <div className="space-y-4">
          {sent.map((capsule: Capsule) => (
            <div key={capsule._id} className="flex items-start gap-4">
              <CapsuleCard capsule={capsule} />
              <button
                onClick={() => handleDelete(capsule._id)}
                className="ml-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                disabled={isPending}
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">보낸 캡슐이 없습니다.</p>
      )}
    </div>
  )
}
