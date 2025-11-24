'use client'

import { LayoutDashboard, Plus, Settings, Trophy } from 'lucide-react'
import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { NavLink } from '../NavLink'
import { CompanyDropdown } from './SidebarCompany'
import { UserDropdown } from './SidebarUser'

const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Sorteios', url: '/sorteios', icon: Trophy },
  { title: 'Criar Sorteio', url: '/ciar-sorteio', icon: Plus },
  { title: 'Configurações', url: '/settings', icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()

  const isCollapsed = state === 'collapsed'

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <CompanyDropdown />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname === item.url

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="group-data-[collapsible=icon]:w-full! group-data-[collapsible=icon]:h-10! group-data-[collapsible=icon]:justify-center flex items-center h-10 gap-3 px-3 py-2 rounded-sm transition-colors hover:bg-sidebar-accent text-sidebar-foreground"
                    >
                      <NavLink
                        href={item.url}
                        activeClassName="bg-primary! text-neutral-900! font-semibold"
                      >
                        <item.icon className="size-5!" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserDropdown />
      </SidebarFooter>
    </Sidebar>
  )
}
