'use client'

import { motion } from 'framer-motion'
import { Sparkles, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginClient() {
  const router = useRouter()
  const search = useSearchParams()

  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [lembrar, setLembrar] = useState(false)

  useEffect(() => {
    // Caso já esteja autenticado, o middleware redireciona. Aqui podemos ler ?from
    // apenas para futura navegação após login.
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!usuario.trim() || !senha.trim()) {
      toast('Campos obrigatórios', {
        description: 'Informe usuário e senha.',
        action: { label: <X size={20} />, onClick: () => {} },
        className: '!bg-red-500 !border-1 !border-red-400',
      })
      return
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: usuario, senha }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.mensagem || 'Falha no login')
      }

      const from = search.get('from') || '/dashboard'
      router.replace(from)
    } catch (err: any) {
      toast('Erro ao entrar', {
        description: err.message,
        action: { label: <X size={20} />, onClick: () => {} },
        className: '!bg-red-500 !border-1 !border-red-400',
      })
    }
  }

  return (
    <div className="min-h-screen bg-background-login relative overflow-hidden flex items-center justify-center">
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
              />
            </div>

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
              />
            </div>

            <div className="flex items-center gap-2 py-3">
              <Checkbox
                id="lembrar"
                checked={lembrar}
                onCheckedChange={(v) => setLembrar(!!v)}
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
