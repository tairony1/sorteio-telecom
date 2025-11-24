'use client'

import { motion } from 'framer-motion'
import { Sparkles, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox' // caso esteja usando shadcn
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/services/api'
import { PAGE_LOGIN } from '@/services/constants'
import { useAuthStore } from '@/store/auth'

const Login = () => {
  const router = useRouter()

  const loginStore = useAuthStore((s) => s.login)
  const lembrarLogin = useAuthStore((s) => s.lembrar)
  const token = useAuthStore((s) => s.token)
  const logout = useAuthStore((s) => s.logout)

  const [usuario, setUsuario] = useState(lembrarLogin || '')
  const [senha, setSenha] = useState('')
  const [lembrar, setLembrar] = useState(!!lembrarLogin)

  useEffect(() => {
    async function validar() {
      if (!token) return

      try {
        const res = await api.get('/me')

        // Se o backend retornou OK, podemos permitir
        if (res.status === 200) {
          router.replace(PAGE_LOGIN)
        } else {
          logout()
        }
      } catch {
        logout()
      }
    }

    validar()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!usuario.trim() || !senha.trim()) {
      toast('Campos obrigatórios', {
        description: 'Informe usuário e senha.',
        action: {
          label: <X size={20} />,
          onClick: () => console.log('Undo'),
        },
        className: '!bg-red-500 !border-1 !border-red-400',
      })
      return
    }

    const auth = await loginStore(usuario, senha, lembrar)

    if (!auth.ok) {
      toast('Erro ao entrar', {
        description: auth.mensagem,
        action: {
          label: <X size={20} />,
          onClick: () => console.log('Undo'),
        },
        className: '!bg-red-500 !border-1 !border-red-400',
      })
      return
    }

    router.push(PAGE_LOGIN)
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Animated background elements */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" /> */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: '1s' }}
      />

      <div className="relative z-10 w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-6 py-2 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Acesso ao Sorteio
              </span>
            </div>

            <h1 className="text-4xl font-bold text-gradient mb-2">
              Bem-vindo!
            </h1>

            <p className="text-muted-foreground">
              Faça login para acessar seus bilhetes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Usuário */}
            <div className="space-y-2">
              <Label htmlFor="usuario" className="text-foreground">
                Usuário
              </Label>
              <Input
                id="usuario"
                type="text"
                placeholder="Digite seu usuário"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className=""
              />
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <Label htmlFor="senha" className="text-foreground">
                Senha
              </Label>
              <Input
                id="senha"
                type="password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className=""
              />
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-2 py-3">
              <Checkbox
                id="lembrar"
                checked={lembrar}
                onCheckedChange={(v) => {
                  console.log('lembrar', !!v)
                  setLembrar(!!v)
                }}
              />
              <Label
                htmlFor="lembrar"
                className="text-foreground cursor-pointer"
              >
                Lembrar usuário
              </Label>
            </div>

            <Button type="submit" className="w-full">
              Acessar
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
