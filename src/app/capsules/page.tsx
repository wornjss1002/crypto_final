// src/app/capsules/page.tsx
import React from 'react'
import Layout from '@/components/Layout'
import CapsuleCard, { Capsule } from '@/components/CapsuleCard'
import { headers } from 'next/headers'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'

export default async function CapsulesPage() {
  const headersList = await headers()
  const host =  headersList.get('host')
  const cookie = headersList.get('cookie') || '';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  const session = await getServerSession(authOptions)

  if (!session) {
    return <div className="text-2xl">로그인이 필요합니다...</div>
  }

  let sent: Capsule[] = []
  let received: Capsule[] = []

  try {
    const response = await fetch(`${baseUrl}/api/capsules`, {
      headers: {
        'Content-Type': 'application/json',
        cookie,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('캡슐 데이터를 불러오지 못했습니다.')
    }

    const data = await response.json()
    sent = data.sent || []
    received = data.received || []
  } catch (error) {
    console.error('캡슐 API 요청 실패:', error)
  }

  return (
    <Layout title="나의 타임캡슐">
      <section>
        <h2 className="text-xl font-semibold mb-4">내가 보낸 캡슐</h2>
        {sent.length === 0 ? (
          <p className="text-gray-500">아직 보낸 캡슐이 없습니다.</p>
        ) : (
          <ul className="space-y-4">
            {sent.map((c: Capsule) => (
              <CapsuleCard key={c._id} capsule={c} />
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">내게 도착한 캡슐</h2>
        {received.length === 0 ? (
          <p className="text-gray-500">열람 가능한 캡슐이 없습니다.</p>
        ) : (
          <ul className="space-y-4">
            {received.map((c: Capsule) => (
              <CapsuleCard key={c._id} capsule={c} />
            ))}
          </ul>
        )}
      </section>

      <div className="text-center mt-6">
        <a
          href="/capsules/new"
          className="inline-block bg-black text-white px-3 py-1 rounded hover:bg-black/75 transition"
        >
          새 타임캡슐 보내기
        </a>
      </div>
    </Layout>
  )
}
