// components/Layout.tsx
'use client'
import React, { ReactNode } from 'react'
import { useSession } from 'next-auth/react'

interface LayoutProps {
  children: ReactNode
  title?: string
}

export default function Layout({ children }: LayoutProps) {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 헤더 제거: 별도 네브바 컴포넌트를 사용하세요 */}
      <main className="max-w-4xl mx-auto p-6 space-y-8">{children}</main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        © 2025 Team Crypto
      </footer>
    </div>
  )
}
