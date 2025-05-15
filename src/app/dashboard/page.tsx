import { auth } from '@/auth'
import { getAllData } from '@/actions/dataActions'
import Image from 'next/image'
import Link from 'next/link'
import { HiPencilAlt } from 'react-icons/hi'
import RemoveBtn_Data from '@/components/RemoveBtn_Data'

export default async function DashboardPage() {
  const session = await auth()
  const { datas } = await getAllData()

  if (!session) return <div className="text-2xl">로그인이 필요합니다...</div>

  // 현재 사용자가 작성한 글만 필터링
  const myPosts = datas.filter((data) => data.userEmail === session.user?.email)

  return (
    <div className="space-y-8">
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
          <p className="text-3xl font-bold">{myPosts.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">최근 작성일</h3>
          <p className="text-lg">
            {myPosts.length > 0
              ? new Date(myPosts[0].createdAt).toLocaleDateString()
              : '작성한 글이 없습니다'}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">계정 생성일</h3>
          <p className="text-lg">정보 없음</p>
        </div>
      </div>

      {/* 내가 쓴 글 목록 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">내가 쓴 글</h2>
        {myPosts.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            아직 작성한 글이 없습니다.
          </p>
        ) : (
          <div className="space-y-4">
            {myPosts.map((post) => (
              <div
                key={post._id}
                className="border dark:border-gray-700 rounded-lg p-4 flex justify-between items-start"
              >
                <div>
                  <h3 className="text-xl font-semibold">{post.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {post.description.length > 100
                      ? `${post.description.substring(0, 100)}...`
                      : post.description}
                  </p>
                  <div className="text-sm text-gray-500 mt-2">
                    작성일: {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <RemoveBtn_Data id={post._id} />
                  <Link href={`/editData/${post._id}`}>
                    <HiPencilAlt
                      size={24}
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
