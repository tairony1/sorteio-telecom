'use client'

import { Building2, ChevronUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { clearAuthCookie } from '@/lib/auth'
import { useAuthStore } from '@/store/auth'

export function CompanyDropdown() {
  const router = useRouter()

  const logout = async () => {
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!res.ok) {
        return
      }

      router.replace('/')
    } catch (err: any) {
      console.log('Falha ao efetuar logout')
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              <Building2 className="mr-2" />
              Acme Inc
              <ChevronUp className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="right"
            align="start"
            className="w-[--radix-popper-anchor-width]"
          >
            <DropdownMenuItem>Trocar organização</DropdownMenuItem>
            <DropdownMenuItem>Configurações</DropdownMenuItem>

            <DropdownMenuItem onClick={logout}>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
