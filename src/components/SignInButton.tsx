import { signIn } from '@/auth'
import Image from 'next/image'

export default function SignInButton() {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <form
        action={async () => {
          'use server'
          await signIn('google', { redirectTo: '/dashboard' })
        }}
      >
        <button
          type="submit"
          className="flex items-center justify-center gap-3 rounded-lg pl-3 hover:opacity-80 transition-opacity"
        >
          <Image src="/google_logo.png" height={24} width={24} alt="google" />
          <span className=" px-4 py-2 rounded-md">Sign in with Google</span>
        </button>
      </form>
      <form
        action={async () => {
          'use server'
          await signIn('github', { redirectTo: '/dashboard' })
        }}
      >
        <button
          type="submit"
          className="flex items-center justify-center gap-3 rounded-lg pl-3 hover:opacity-80 transition-opacity"
        >
          <Image src="/github_logo.png" height={24} width={24} alt="github" />
          <span className="px-4 py-2 rounded-md">Sign in with Github</span>
        </button>
      </form>
    </div>
  )
}
