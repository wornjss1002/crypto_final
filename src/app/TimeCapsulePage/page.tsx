import { getAllTopics } from '@/actions/topicActions'
import TopicsList from '@/components/Topiclist'
import Link from 'next/link'

export default async function AddTopic() {
  const { topics } = await getAllTopics()
  return (
    <div className="max-w-3xl mx-auto mt-8">
      <Link
        className="text-lg p-1 font-bold rounded-md bg-black text-white hover:bg-black/75 dark:bg-white dark:text-black dark:hover:bg-white/75"
        href="/addTopic"
      >
        글쓰기
      </Link>
      <TopicsList topics={topics} />
    </div>
  )
}
