// src/app/page.tsx (메인 페이지 업데이트)
import React from 'react'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { getAllData } from '@/actions/dataActions'
import { getAllTopics } from '@/actions/topicActions'
import DatasSimple from '@/components/DataSimple'
import TopicsSimple from '@/components/TopicSimple'

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
    <Layout title="타임캡슐 게시판 홈">
      <div>
        <h1 className="text-3xl font-bold mb-4">타임캡슐 게시판</h1>
        <p className="mb-6">
          이 웹사이트는 둥근모 폰트를 사용하여 작성되었습니다!
        </p>

        <section className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">타임캡슐 게시판</h2>
            <Link
              href="/TimeCapsulePage"
              className="text-lg font-bold bg-black text-white px-3 py-1 rounded hover:bg-black/75"
            >
              글쓰기
            </Link>
          </div>
          <TopicsSimple topics={topics} />
        </section>

        <section className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">추천 게시판</h2>
            <Link
              href="/RecommendPage"
              className="text-lg font-bold bg-black text-white px-3 py-1 rounded hover:bg-black/75"
            >
              글쓰기
            </Link>
          </div>
          <DatasSimple datas={datas} />
        </section>
      </div>
    </Layout>
  )
}
