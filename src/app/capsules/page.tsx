// src/app/capsules/page.tsx
import React from 'react'
import Layout from '@/components/Layout'
import CapsuleCard, { Capsule } from '@/components/CapsuleCard'
import { headers } from 'next/headers'

export default async function CapsulesPage() {
  const host = headers().get('host')
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  let sent: Capsule[] = []
  let received: Capsule[] = []

  try {
    const res = await fetch(`${baseUrl}/api/capsules`, { cache: 'no-store' })

    if (!res.ok) {
      console.error('캡슐 데이터를 불러오지 못했습니다:', res.statusText)
    } else {
      const data = await res.json()
      sent = data.sent || []
      received = data.received || []
    }
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
