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
import { useAuthStore } from '@/store/auth'

export function CompanyDropdown() {
  const router = useRouter()
  const logout = useAuthStore((s) => s.logout)

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

            <DropdownMenuItem
              onClick={() => {
                logout()
                router.replace('/') // equivalente ao navigate("/", { replace: true })
              }}
            >
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
