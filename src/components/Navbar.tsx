'use client'
import Link from 'next/link'
import LoginForm from '@/components/LoginForm'
import { useState } from 'react'
import { signOut, useSession } from 'next-auth/react'

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <nav className="flex justify-between items-center px-4 sm:px-8 py-2 border-b-8 border-double border-b-black dark:border-b-white">
      {/* 좌측 로고 + 드롭다운 메뉴 */}
      <div className="flex items-center">
        {/* 모바일 메뉴 토글 */}
        <button
          className="lg:hidden mr-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isMobileMenuOpen
                  ? 'M6 18L18 6M6 6l12 12'
                  : 'M4 6h16M4 12h16M4 18h16'
              }
            />
          </svg>
        </button>

        {/* 드롭다운 포함 데스크탑 로고 */}
        <div
          className="relative hidden lg:block"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <Link
            href="/"
            className="text-2xl sm:text-3xl font-extrabold hover:opacity-75 block"
          >
            Time Capsule
          </Link>

          <div
            className={`absolute top-full left-0 w-48 bg-white dark:bg-black shadow-lg rounded-md transition-all duration-300 ease-in-out transform origin-top z-50 ${
              isDropdownOpen
                ? 'opacity-100 scale-y-100 pointer-events-auto'
                : 'opacity-0 scale-y-0 pointer-events-none'
            }`}
          >
            <ul className="py-2">
              <li>
                <Link
                  href="/capsules/sent"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-black dark:hover:text-white/75"
                >
                  내가 보낸 캡슐
                </Link>
              </li>
              <li>
                <Link
                  href="/capsules/received"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-black dark:hover:text-white/75"
                >
                  내게 도착한 캡슐
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-black dark:hover:text-white/75"
                >
                  팀 소개
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 모바일용 로고 */}
        <Link
          href="/"
          className="text-2xl sm:text-3xl lg:hidden font-extrabold hover:opacity-75"
        >
          Time Capsule
        </Link>
      </div>

      {/* 우측 로그인/로그아웃 */}
      <div className="flex items-center space-x-4">
        {session ? (
          <>
            <Link
              href="/dashboard"
              className="bg-black text-white dark:bg-white dark:text-black text-base sm:text-lg font-bold px-3 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-black/75 dark:hover:bg-white/75"
            >
              Dashboard
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="bg-black text-white dark:bg-white dark:text-black text-base sm:text-lg font-bold px-3 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-black/75 dark:hover:bg-white/75"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <LoginForm />
            <Link
              href="/register"
              className="bg-black text-white dark:bg-white dark:text-black text-base sm:text-lg font-bold px-3 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-black/75 dark:hover:bg-white/75"
            >
              Sign In
            </Link>
          </>
        )}
      </div>

      {/* 모바일 메뉴 */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`fixed right-0 top-0 h-full w-64 bg-white dark:bg-black transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 space-y-2">
            <Link
              href="/capsules/sent"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-black dark:hover:text-white/75"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              내가 보낸 캡슐
            </Link>
            <Link
              href="/capsules/received"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-black dark:hover:text-white/75"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              내게 도착한 캡슐
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-black dark:hover:text-white/75"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              팀 소개
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
