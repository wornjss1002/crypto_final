import Link from 'next/link'
import React from 'react'
import { FaCodeBranch, FaEye, FaStar } from 'react-icons/fa'
//const username = 'bradtraversy'
const username = 'Hoodscp'

export default async function ReposPage() {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos`,
    { next: { revalidate: 60 } }
  )
  const repos = await response.json()

  return (
    <div className="font-[family-name:var(--font-geist-mono)]">
      <h1 className="text-4xl font-extrabold m-4 text-center">
        Github Repositories of {username}
      </h1>
      <ul>
        {repos.map((repo: any) => (
          <li key={repo.id} className="bg-gray-100 m-4 p-4 rounded-md">
            <Link href={`/repos/${repo.name}`}>
              <h3 className="text-xl font-bold">{repo.name}</h3>
              <p>{repo.description}</p>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FaStar /> {repo.stargazers_count}
                  <span className="flex items-center gap-2">
                    <FaCodeBranch /> {repo.forks_count}
                  </span>
                  <span className="flex items-center gap-2">
                    <FaEye /> {repo.watchers_count}
                  </span>
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
