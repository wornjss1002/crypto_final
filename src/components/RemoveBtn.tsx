'use client'
import { deleteTopic } from '@/actions/topicActions'
import { HiOutlineTrash } from 'react-icons/hi'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function RemoveBtn({ id }: { id: string }) {
  const { data: session } = useSession()
  const router = useRouter()

  const handleDelete = async () => {
    if (!session) {
      router.push('/login')
      return
    }

    const confirmed = confirm('이 토픽을 삭제하시겠습니까?')
    if (confirmed) {
      try {
        await deleteTopic(id)
      } catch (error) {
        console.error('삭제 중 오류 발생:', error)
        alert('삭제 중 오류가 발생했습니다.')
      }
    }
  }
  return (
    <button className="text-red-600 hover:text-red-800" onClick={handleDelete}>
      <HiOutlineTrash size={24} />
    </button>
  )
}
