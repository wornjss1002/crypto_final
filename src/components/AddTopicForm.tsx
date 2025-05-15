'use client'
import { createTopic } from '@/actions/topicActions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AddTopicForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createTopic(title, description)
      router.push('/')
    } catch (error) {
      console.error('게시글 생성 중 오류 : ', error)
      alert('게시글 생성 중 오류가 발생했습니다.')
    }
  }
  return (
    <form
      className="flex flex-col gap-3 dark:bg-gray-900"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl ml-2 dark:text-white">게시글 추가</h1>
      <input
        type="text"
        className="border border-gray-500 p-4 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
        placeholder="게시글 제목"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setTitle(e.target.value)
        }
        value={title}
      />
      <textarea
        className="border border-gray-500 p-4 h-32 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
        placeholder="본문 내용"
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setDescription(e.target.value)
        }
        value={description}
      />
      <button
        className="bg-gray-300 text-gray-800 font-bold px-6 py-3 w-fit rounded-md hover:bg-gray-500 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        type="submit"
      >
        게시글 추가
      </button>
    </form>
  )
}
