import SentCapsulesClient from './SentCapsulesClient'
import { Capsule } from '@/components/CapsuleCard'
import { headers } from 'next/headers'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'

export default async function SentCapsulesPage() {
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

  let sent: Capsule[] = []
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
    sent = data.sent || []
  } catch (error) {
    console.error('캡슐 API 요청 실패:', error)
  }

  return <SentCapsulesClient initialSent={sent} />
}
