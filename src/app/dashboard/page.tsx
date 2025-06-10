import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import Image from 'next/image'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <div className="text-2xl">로그인이 필요합니다...</div>
  }

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
          <p className="text-3xl font-bold">-</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">최근 작성일</h3>
          <p className="text-lg">-</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">계정 생성일</h3>
          <p className="text-lg">정보 없음</p>
        </div>
      </div>

      {/* 내가 쓴 글 목록 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">내가 쓴 글</h2>
        <p className="text-gray-600 dark:text-gray-400">데이터가 없습니다.</p>
      </div>
    </div>
  )
}
