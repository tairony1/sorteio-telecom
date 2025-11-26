// import { NextResponse } from 'next/server'
// import { clearAuthCookie } from '@/lib/auth'

// export async function POST() {
//   await clearAuthCookie()
//   return NextResponse.json({ ok: true })
// }

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // pegar cookie real do usuário
  const cookie = request.cookies.get('auth')?.value

  const backendResponse = await fetch('http://localhost:3333/logout', {
    method: 'POST',
    headers: {
      Cookie: cookie ? `auth=${cookie}` : '',
    },
  })

  const res = NextResponse.json({ success: true })

  // limpar cookie no Next também (caso o backend mande Set-Cookie)
  const rawSetCookie = backendResponse.headers.get('set-cookie')
  if (rawSetCookie) {
    res.headers.set('set-cookie', rawSetCookie)
  }

  return res
}
