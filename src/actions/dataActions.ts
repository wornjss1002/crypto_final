'use server'
import { convertDocToObj } from '@/libs/helpers'
import connectMongoDB from '@/libs/mongodb'
import Data from '@/models/data'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'

// create : Data
export async function createData(title: string, description: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('로그인이 필요합니다')
  }

  // 세션 정보 로깅
  console.log('Creating with session:', {
    user: session.user,
    email: session.user.email,
    name: session.user.name,
  })

  try {
    await connectMongoDB()

    // 생성할 데이터 로깅
    const newData = {
      title,
      description,
      userId: session.user.email,
      userName: session.user.name || 'Unknown User',
      userEmail: session.user.email,
    }
    console.log('Attempting to create:', newData)

    const doc = await Data.create(newData)
    console.log('Created document:', JSON.stringify(doc, null, 2))

    revalidatePath('/')
    return { success: true, topic: convertDocToObj(doc) }
  } catch (error) {
    console.error('Create Data Error:', error)
    throw new Error(`토픽 생성에 실패했습니다: ${error}`)
  }
}

//  Update : Data (PUT)
export async function updateData(
  id: string,
  title: string,
  description: string
) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('로그인이 필요합니다')
  }

  try {
    await connectMongoDB()
    const data = await Data.findById(id)
    if (!data) throw new Error('토픽을 찾을 수 없습니다.')

    // 작성자 확인
    if (data.userEmail !== session.user.email) {
      throw new Error('수정 권한이 없습니다')
    }

    const doc = await Data.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    )
    revalidatePath('/')
    return { success: true, data: convertDocToObj(doc) }
  } catch (error) {
    throw new Error(`토픽 수정에 실패했습니다: ${error}`)
  }
}

// GET by ID : Data
export async function getData(id: string) {
  try {
    await connectMongoDB()
    const doc = await Data.findById(id)
    if (!doc) throw new Error('토픽을 찾을 수 없습니다.')
    return { success: true, data: convertDocToObj(doc) }
  } catch (error) {
    throw new Error(`토픽 조회에 실패했습니다: ${error}`)
  }
}

// GET ALL : DATA
export async function getAllData() {
  try {
    await connectMongoDB()
    const docs = await Data.find({}).sort({ createdAt: -1 })
    const datas = docs.map((doc) => convertDocToObj(doc))
    return { success: true, datas }
  } catch (error) {
    throw new Error(`토픽 목록 조회에 실패했습니다: ${error}`)
  }
}

// DELETE : Data
export async function deleteData(id: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('로그인이 필요합니다')
  }

  try {
    await connectMongoDB()
    const data = await Data.findById(id)
    if (!data) throw new Error('토픽을 찾을 수 없습니다.')

    // 작성자 확인
    if (data.userEmail !== session.user.email) {
      throw new Error('삭제 권한이 없습니다')
    }

    await Data.findByIdAndDelete(id)
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    throw new Error(`토픽 삭제에 실패했습니다: ${error}`)
  }
}
