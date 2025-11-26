// import 'server-only'

// import { cookies } from 'next/headers'

// const AUTH_COOKIE = 'auth'

// export type Session = {
//   userId: string
//   email?: string
//   name?: string
// }

// export async function setAuthCookie(token: string) {
//   const cookieStore = await cookies()
//   cookieStore.set(AUTH_COOKIE, token, {
//     httpOnly: true,
//     secure: true, // em dev pode setar false se necessário, mas mantenha true em prod
//     sameSite: 'strict',
//     path: '/',
//     maxAge: 60 * 60 * 8, // 8h
//   })
// }

// export async function clearAuthCookie() {
//   const cookieStore = await cookies()
//   cookieStore.set(AUTH_COOKIE, '', {
//     httpOnly: true,
//     secure: true,
//     sameSite: 'strict',
//     path: '/',
//     maxAge: 0,
//   })
// }
