import { LayoutDashboard, Trophy, Plus, Eye, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";

const menuItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Sorteios", url: "/admin/sorteios", icon: Trophy },
  { title: "Criar Sorteio", url: "/admin/criar-sorteio", icon: Plus },
];

export function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = useAuthStore((s) => s.logout);

  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-20" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-sidebar border-r-1 border-sidebar-border">
        <div className="p-4 h-16 border-b border-sidebar-border">
          <h2
            className={`font-bold text-lg text-sidebar-primary ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            Sorteio Telecom
          </h2>
          {isCollapsed && (
            <Trophy className="h-6 w-6 text-sidebar-primary mx-auto" />
          )}
        </div>

        <SidebarGroup>
          {/* <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Menu
          </SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink
                        to={item.url}
                        className="flex items-center h-10 gap-3 px-3 py-2 rounded-sm transition-colors hover:bg-sidebar-accent text-sidebar-foreground"
                        activeClassName="!bg-accent !text-accent-foreground font-semibold"
                      >
                        <item.icon className="h-5 w-5 !size-5" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-sidebar-foreground rounded-sm hover:bg-sidebar-accent hover:text-white"
            onClick={() => {
              logout();
              navigate(`/`, { replace: true });
            }}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span>Sair</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
