import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Navbar from '@/components/Navbar'
import { NextAuthProvider } from '@/components/Providers'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth' // auth.ts에서 export된 authOptions 가져옴

const geistSans = localFont({
  src: './fonts/DungGeunMo.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/DungGeunMo.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: '웹이추',
  description: 'Create, Read, Update, and Delete in MongoDB',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-[family-name:var(--font-geist-mono)]`}
      >
        <NextAuthProvider session={session}>
          <Navbar />
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 max-w-4xl mx-auto px-2 sm:px-0 lg:px-0 py-10">
              <div className="space-y-8">
                <main>
                  <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4">{children}</div>
                  </div>
                </main>
              </div>
            </div>
          </div>
        </NextAuthProvider>
      </body>
    </html>
  )
}
