import { getAllData } from '@/actions/dataActions'
import { getAllTopics } from '@/actions/topicActions'
import DatasSimple from '@/components/DataSimple'
import TopicsSimple from '@/components/TopicSimple'
import Link from 'next/link'
import { FaCodeBranch, FaEye, FaStar } from 'react-icons/fa'
const username = 'Hoodscp'

export default async function Home() {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos`,
    { next: { revalidate: 60 } }
  )
  const repos = await response.json()
  const { topics } = await getAllTopics()
  const { datas } = await getAllData()
  return (
    <div>
      <div>
        <div>
          <h1 className="text-3xl font-bold mb-4 ">타임캡슐 게시판</h1>
          <p className="mb-6 ">
            이 웹사이트는 둥근모 폰트를 사용하여 작성되었습니다!
          </p>
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <a
                href="/TimeCapsulePage"
                className="text-xl font-semibold p-1  hover:text-black/75 dark:hover:text-white/75"
              >
                타임캡슐 게시판
              </a>
              <Link
                className="text-lg p-1 font-bold rounded-md bg-black text-white dark:bg-white dark:text-black hover:bg-black/75 dark:hover:bg-white/75"
                href="/addTopic"
              >
                글쓰기
              </Link>
            </div>
            <TopicsSimple topics={topics} />
          </div>
          <div className="mt-8">
            <div className="flex justify-between mb-2">
              <a
                href="/RecommendPage"
                className="text-xl font-semibold p-1  hover:text-black/75 dark:hover:text-white/75"
              >
                추천 게시판
              </a>
              <Link
                className="text-lg p-1 font-bold rounded-md bg-black text-white hover:bg-black/75 dark:bg-white dark:text-black dark:hover:bg-white/75"
                href="/addData"
              >
                글쓰기
              </Link>
            </div>
            <DatasSimple datas={datas} />
          </div>
          <div className="mt-8"></div>
        </div>
      </div>
    </div>
  )
}
