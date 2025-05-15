export interface Topic {
  _id: string
  title: string
  description: string
  userId: string
  userName: string
  userEmail: string
  createdAt: string
  updatedAt: string
}

export function convertDocToObj(doc: any) {
  const converted = JSON.parse(JSON.stringify(doc))
  console.log('Converted document:', converted)
  return converted
}
