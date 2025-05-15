import Repo from '@/components/Repo'
import RepoDirs from '@/components/RepoDirs'
import Link from 'next/link'
import React, { Suspense } from 'react'
export default function RepoPage({ params }: { params: { name: string } }) {
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col max-w-lg w-full px-4">
        <Link
          href="/repos"
          className="bg-black hover:bg-gray-700 text-white text-center font-bold py-2 px-4 rounded-md mx-32 mb-4"
        >
          Back to Repositories
        </Link>

        <Suspense fallback={<div>Loading repo...</div>}>
          <Repo name={params.name} />
        </Suspense>

        <Suspense fallback={<div>Loading directories...</div>}>
          <RepoDirs name={params.name} />
        </Suspense>
      </div>
    </div>
  )
}
