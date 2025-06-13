import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import Image from 'next/image'
import { headers } from 'next/headers'
import dbConnect from '@/libs/mongodb'
import UserModel, { UserType } from '@/models/user'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return <div className="text-2xl">로그인이 필요합니다...</div>
  }

  // API fetch 참고: capsules/page.tsx와 동일하게 headers/cookie 사용
  const headersList = await headers()
  const host = headersList.get('host')
  const cookie = headersList.get('cookie') || ''
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  let sent: any[] = []
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
  } catch {
    // 에러 핸들링
  }

  // 계정 생성일 조회
  await dbConnect()
  let createdAt = null
  if (session.user?.email) {
    const user = await UserModel.findOne({
      email: session.user.email,
    }).lean<UserType>()
    createdAt = user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString()
      : null
  }

  const totalPosts = sent.length
  const latestPostDate =
    totalPosts > 0 ? new Date(sent[0].createdAt).toLocaleDateString() : '-'

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">대시보드</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* datas.map 등 모두 제거 */}
      </div>

      {/* 사용자 프로필 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center space-x-4">
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt="Profile"
              width={80}
              height={80}
              className="rounded-full"
            />
          )}
          <div>
            <h2 className="text-2xl font-bold">{session.user?.name}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {session.user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* 통계 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">총 작성글</h3>
          <p className="text-3xl font-bold">{totalPosts}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">최근 작성일</h3>
          <p className="text-lg">{latestPostDate}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">계정 생성일</h3>
          <p className="text-lg">{createdAt || '정보 없음'}</p>
        </div>
      </div>

      {/* 내가 쓴 글 목록 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">내가 쓴 글</h2>
        {sent.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">데이터가 없습니다.</p>
        ) : (
          <ul className="space-y-2">
            {sent.map((capsule: any) => (
              <li key={capsule._id} className="border-b pb-2">
                <div className="font-semibold">
                  {capsule.content?.slice(0, 30) || '(내용 없음)'}
                </div>
                <div className="text-xs text-gray-500">
                  작성일: {new Date(capsule.createdAt).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
