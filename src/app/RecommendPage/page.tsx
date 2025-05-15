import { getAllData } from '@/actions/dataActions'
import DatasList from '@/components/Datalist'
import Link from 'next/link'
export default async function addData() {
  const { datas } = await getAllData()
  return (
    <div className="max-w-3xl mx-auto mt-8">
      <Link
        className="text-lg p-1 font-bold rounded-md bg-black text-white hover:bg-black/75 dark:bg-white dark:text-black dark:hover:bg-white/75"
        href="/addData"
      >
        글쓰기
      </Link>
      <DatasList datas={datas} />
    </div>
  )
}
