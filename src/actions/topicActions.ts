'use server'
import { convertDocToObj } from '@/libs/helpers'
import connectMongoDB from '@/libs/mongodb'
import Topic from '@/models/topic'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'

//  Create (POST)
export async function createTopic(title: string, description: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('로그인이 필요합니다')
  }

  // 세션 정보 로깅
  console.log('Creating topic with session:', {
    user: session.user,
    email: session.user.email,
    name: session.user.name,
  })

  try {
    await connectMongoDB()
    const newTopic = {
      title,
      description,
      userId: session.user.email,
      userName: session.user.name || 'Unknown User',
      userEmail: session.user.email,
    }
    console.log('Attempting to create topic:', newTopic)
    const doc = await Topic.create(newTopic)
    console.log('Created topic document:', JSON.stringify(doc, null, 2))
    revalidatePath('/')
    return { success: true, topic: convertDocToObj(doc) }
  } catch (error) {
    console.error('Create Topic Error:', error)
    throw new Error(`토픽 생성에 실패했습니다: ${error}`)
  }
}

//  Update (PUT)
export async function updateTopic(
  id: string,
  title: string,
  description: string
) {
  try {
    await connectMongoDB()
    const doc = await Topic.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    )
    if (!doc) throw new Error('토픽을 찾을 수 없습니다.')
    revalidatePath('/')
    return { success: true, topic: convertDocToObj(doc) }
  } catch (error) {
    console.error('Update Topic Error:', error)
    throw new Error(`토픽 수정에 실패했습니다: ${error}`)
  }
}

// GET by ID
export async function getTopic(id: string) {
  try {
    await connectMongoDB()
    const doc = await Topic.findById(id)
    if (!doc) throw new Error('토픽을 찾을 수 없습니다.')
    return { success: true, topic: convertDocToObj(doc) }
  } catch (error) {
    console.error('Get Topic Error:', error)
    throw new Error(`토픽 조회에 실패했습니다: ${error}`)
  }
}

// GET ALL
export async function getAllTopics() {
  try {
    await connectMongoDB()
    const docs = await Topic.find({}).sort({ createdAt: -1 })
    const topics = docs.map((doc) => convertDocToObj(doc))
    return { success: true, topics }
  } catch (error) {
    console.error('Get All Topics Error:', error)
    throw new Error(`토픽 목록 조회에 실패했습니다: ${error}`)
  }
}

// DELETE
export async function deleteTopic(id: string) {
  try {
    await connectMongoDB()
    const doc = await Topic.findByIdAndDelete(id)
    if (!doc) throw new Error('토픽을 찾을 수 없습니다.')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Delete Topic Error:', error)
    throw new Error(`토픽 삭제에 실패했습니다: ${error}`)
  }
}
