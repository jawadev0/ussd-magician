import { Smartphone, CreditCard, Zap, Users, Home, Phone } from "lucide-react";
import { NavLink } from "react-router-dom";

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

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Devices", url: "/devices", icon: Smartphone },
  { title: "SIM Cards", url: "/simcards", icon: CreditCard },
  { title: "Activation", url: "/activation", icon: Zap },
  { title: "Top-up", url: "/topup", icon: CreditCard },
  { title: "USSD Activation", url: "/ussd-activation", icon: Phone },
  { title: "Users", url: "/users", icon: Users },
];

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar className={`${open ? "w-60" : "w-14"} border-r border-border/50 bg-card/50 backdrop-blur-sm`}>
      <SidebarContent className="py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {open && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-accent/50 transition-all duration-200">
                    <NavLink 
                      to={item.url} 
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2 ${
                          isActive 
                            ? "bg-primary text-primary-foreground font-medium shadow-md" 
                            : "text-foreground/80 hover:text-foreground"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {open && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
