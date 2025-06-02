import React from 'react'
import Layout from '@/components/Layout'
import CapsuleCard, { Capsule } from '@/components/CapsuleCard'
import { headers } from 'next/headers'

export default async function CapsulesPage() {
  // 런타임 호스트 & 프로토콜 설정
  const host = headers().get('host')
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  // 절대 URL로 데이터 가져오기
  const res = await fetch(`${baseUrl}/api/capsules`, { cache: 'no-store' })
  const { sent, received } = await res.json()

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
