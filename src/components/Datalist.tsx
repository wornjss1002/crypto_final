'use client'
import Link from 'next/link'
import { HiPencilAlt } from 'react-icons/hi'
import RemoveBtn_Data from './RemoveBtn_Data'
import { useSession } from 'next-auth/react'

interface Data {
  _id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
  userEmail: string
  userName: string
}

interface datasListProps {
  datas: Data[]
}

export default function DatasList({ datas }: datasListProps) {
  const { data: session, status } = useSession()

  // 디버깅용 로그
  console.log('Session status:', status)
  console.log('Current session:', session)

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (status === 'unauthenticated') {
    return (
      <div className="dark:bg-gray-900">
        {datas.map((data) => (
          <div
            key={data._id}
            className="p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 my-3 flex justify-between gap-5 items-start text-gray-900 dark:text-white"
          >
            <div>
              <h2 className="text-2xl font-bold">{data.title}</h2>
              <div className="text-gray-700 dark:text-gray-300">
                {data.description}
              </div>
              <div className="flex gap-4 text-gray-600 dark:text-gray-400">
                <p>작성자: {data.userName}</p>
                <p>Created: {new Date(data.createdAt).toLocaleDateString()}</p>
                <p>Updated: {new Date(data.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">(로그인이 필요합니다)</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="dark:bg-gray-900">
      {datas.map((data) => {
        // 전체 데이터 로깅
        console.log('Full data object:', JSON.stringify(data, null, 2))
        console.log('Comparing emails:', {
          dataEmail: data.userEmail,
          sessionEmail: session?.user?.email,
          isMatch: session?.user?.email === data.userEmail,
        })

        return (
          <div
            key={data._id}
            className="p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 my-3 flex justify-between gap-5 items-start text-gray-900 dark:text-white"
          >
            <div>
              <h2 className="text-2xl font-bold">{data.title}</h2>
              <div className="text-gray-700 dark:text-gray-300">
                {data.description}
              </div>
              <div className="flex gap-4 text-gray-600 dark:text-gray-400">
                <p>작성자: {data.userName}</p>
                <p>Created: {new Date(data.createdAt).toLocaleDateString()}</p>
                <p>Updated: {new Date(data.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
            {session?.user?.email === data.userEmail ? (
              <div className="flex gap-2">
                <RemoveBtn_Data id={data._id} />
                <Link href={`/editData/${data._id}`}>
                  <HiPencilAlt
                    size={24}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  />
                </Link>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                (다른 사용자의 게시물)
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
