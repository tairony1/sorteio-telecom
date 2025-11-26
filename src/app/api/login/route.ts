// import { NextResponse } from 'next/server'
// import { setAuthCookie } from '@/lib/auth'

// export async function POST(request: Request) {
//   try {
//     const body = await request.json()
//     const { login, senha } = body || {}

//     if (!login || !senha) {
//       return NextResponse.json({ mensagem: 'Credenciais inválidas' }, { status: 400 })
//     }

//     // Chama o backend de autenticação
//     const res = await fetch('http://localhost:3333/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ login, senha }),
//     })

//     if (!res.ok) {
//       const data = await res.json().catch(() => ({ mensagem: 'Login inválido' }))
//       return NextResponse.json({ mensagem: data?.mensagem ?? 'Login inválido' }, { status: res.status })
//     }

//     const data = await res.json()
//     const token = data?.token
//     if (!token) {
//       return NextResponse.json({ mensagem: 'Token não recebido' }, { status: 500 })
//     }

//     await setAuthCookie(token)

//     return NextResponse.json({ ok: true })
//   } catch (e) {
//     return NextResponse.json({ mensagem: 'Erro no login' }, { status: 500 })
//   }
// }

import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { login, senha } = await request.json()

    if (!login || !senha) {
      return NextResponse.json(
        { mensagem: 'Credenciais inválidas' },
        { status: 400 }
      )
    }

    // Repassa login para backend — permitindo enviar/receber cookies
    const backendResponse = await fetch('http://localhost:3333/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, senha }),
      credentials: 'include', // 🔥 ESSENCIAL PARA RECEBER O COOKIE set-cookie
    })

    // Se erro:
    if (!backendResponse.ok) {
      const data = await backendResponse.json().catch(() => ({}))
      return NextResponse.json(
        { mensagem: data?.mensagem ?? 'Login inválido' },
        { status: backendResponse.status }
      )
    }

    // Criar resposta vazia
    const response = NextResponse.json({ ok: true })

    // 🔥 repassar o cookie do backend para o browser
    const rawSetCookie = backendResponse.headers.get('set-cookie')
    if (rawSetCookie) {
      response.headers.set('set-cookie', rawSetCookie)
    }

    return response
  } catch (e) {
    return NextResponse.json({ mensagem: 'Erro no login' }, { status: 500 })
  }
}
