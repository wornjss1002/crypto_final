import React from 'react'
import CapsuleCard, { Capsule } from '@/components/CapsuleCard'
import { headers } from 'next/headers'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'

export default async function ReceivedCapsulesPage() {
  const headersList = await headers()
  const host = headersList.get('host')
  const cookie = headersList.get('cookie') || ''
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  const session = await getServerSession(authOptions)
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">로그인이 필요합니다.</p>
      </div>
    )
  }

  let received: Capsule[] = []
  try {
    const response = await fetch(`${baseUrl}/api/capsules`, {
      headers: {
        'Content-Type': 'application/json',
        cookie,
      },
      cache: 'no-store',
    })
    if (!response.ok) throw new Error('캡슐 데이터를 불러오지 못했습니다.')
    const data = await response.json()
    received = data.received || []
  } catch (error) {
    console.error('캡슐 API 요청 실패:', error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">내게 도착한 캡슐</h1>
      {received.length > 0 ? (
        <div className="space-y-4">
          {received.map((capsule: Capsule) => (
            <div key={capsule._id}>
              <CapsuleCard capsule={{ ...capsule, content: '' }} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">열람 가능한 캡슐이 없습니다.</p>
      )}
    </div>
  )
}
