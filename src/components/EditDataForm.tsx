'use client'
import { updateData } from '@/actions/dataActions'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

interface EditDataFormProps {
  id: string
  initialTitle: string
  initialDescription: string
}

export default function EditDataForm({
  id,
  initialTitle,
  initialDescription,
}: EditDataFormProps) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const router = useRouter()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateData(id, title, description)
      router.push('/')
      router.refresh()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <form
      className="max-w-4xl mx-auto flex flex-col gap-3 dark:bg-gray-900"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl dark:text-white">게시글 수정</h1>
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
        게시글 수정
      </button>
    </form>
  )
}
