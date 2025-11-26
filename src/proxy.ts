import { jwtVerify } from 'jose'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const PUBLIC_PATHS = new Set(['/', '/api/login', '/api/logout'])

const PUBLIC_PREFIXES = [
  '/_next',
  '/favicon.ico',
  '/icons',
  '/images',
  '/public',
  '/api/health',
]

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/sorteios',
  '/sorteio',
  '/criar-sorteio',
]

// valida JWT local
async function validateTokenLocal(token: string): Promise<boolean> {
  try {
    const secret = new TextEncoder().encode(process.env.SECRET_JWT!)
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth')?.value

  // Ignorar assets públicos
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Rotas públicas
  if (PUBLIC_PATHS.has(pathname)) {
    if (token && token.trim() !== '') {
      const valid = await validateTokenLocal(token)
      if (valid && pathname === '/') {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
      }
    }
    return NextResponse.next()
  }

  // Rotas protegidas
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))

  if (isProtected) {
    if (!token || token.trim() === '') {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }

    const valid = await validateTokenLocal(token)
    if (!valid) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/sorteios/:path*',
    '/sorteio/:path*',
    '/criar-sorteio/:path*',
    '/',
  ],
}

// // src/proxy.ts

// import { jwtVerify } from 'jose'
// import type { NextRequest } from 'next/server'
// import { NextResponse } from 'next/server'

// // Rotas públicas
// const PUBLIC_PATHS = new Set(['/', '/api/login', '/api/logout'])

// // Prefixos permitidos
// const PUBLIC_PREFIXES = [
//   '/_next',
//   '/favicon.ico',
//   '/icons',
//   '/images',
//   '/public',
//   '/api/health',
// ]

// // Rotas protegidas
// const PROTECTED_PREFIXES = [
//   '/dashboard',
//   '/sorteios',
//   '/sorteio',
//   '/criar-sorteio',
// ]

// // Validação local do Token usando JWT_SECRET
// async function validateTokenLocal(token: string): Promise<boolean> {
//   try {
//     const secret = new TextEncoder().encode(process.env.SECRET_JWT!)
//     await jwtVerify(token, secret)
//     return true
//   } catch (e) {
//     return false
//   }
// }

// export async function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl

//   // Prefixos públicos
//   if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
//     return NextResponse.next()
//   }

//   // Rotas públicas explicitadas
//   if (PUBLIC_PATHS.has(pathname)) {
//     const token = request.cookies.get('auth')?.value
//     if (token) {
//       const valid = await validateTokenLocal(token)

//       if (valid && pathname === '/') {
//         const url = request.nextUrl.clone()
//         url.pathname = '/dashboard'
//         return NextResponse.redirect(url)
//       }
//     }
//     return NextResponse.next()
//   }

//   // Rotas protegidas
//   const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))
//   if (isProtected) {
//     const token = request.cookies.get('auth')?.value

//     if (!token) {
//       const url = request.nextUrl.clone()
//       url.pathname = '/'
//       url.searchParams.set('from', pathname)
//       return NextResponse.redirect(url)
//     }

//     const valid = await validateTokenLocal(token)
//     if (!valid) {
//       const url = request.nextUrl.clone()
//       url.pathname = '/'
//       url.searchParams.set('from', pathname)
//       return NextResponse.redirect(url)
//     }

//     return NextResponse.next()
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: [
//     '/dashboard/:path*',
//     '/sorteios/:path*',
//     '/sorteio/:path*',
//     '/criar-sorteio/:path*',
//     '/',
//   ],
// }
