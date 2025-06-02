// next.config.mjs

// 1) dotenv 로드
import { config } from 'dotenv'
config({ path: './.env' }) // .env 파일 경로를 정확히 지정

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  // (선택) 클라이언트 코드에서 특정 env 변수를 사용하고 싶다면
  // env: {
  //   NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  //   MONGODB_URI: process.env.MONGODB_URI,
  // },
}

export default nextConfig
