'use client'

import { SessionProvider } from 'next-auth/react'
import type { Session } from 'next-auth'
import type { ReactNode, FC } from 'react'

interface NextAuthProviderProps {
  children: ReactNode
  session: Session | null
}

export const NextAuthProvider: FC<NextAuthProviderProps> = ({ children, session }) => {
  return <SessionProvider session={session}>{children}</SessionProvider>
}
