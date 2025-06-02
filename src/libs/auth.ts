// src/lib/auth.ts
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 12

/**
 * 주어진 평문 비밀번호를 해시하여 반환합니다.
 * @param password — 사용자 입력 평문
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * 평문 비밀번호가 해시값과 일치하는지 검증합니다.
 * @param password — 사용자 입력 평문
 * @param hashed — DB에 저장된 bcrypt 해시
 */
export async function verifyPassword(
  password: string,
  hashed: string
): Promise<boolean> {
  return bcrypt.compare(password, hashed)
}
