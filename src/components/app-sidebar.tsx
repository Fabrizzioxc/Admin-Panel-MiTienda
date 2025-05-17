"use client"

import type * as React from "react"
import { BarChartIcon, BoxIcon, ListIcon as CategoriesIcon, DollarSignIcon, LayoutDashboardIcon, TagIcon, UsersIcon } from 'lucide-react'

import { NavMain } from "./nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Admin",
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Productos",
      url: "/productos",
      icon: BoxIcon,
    },
    {
      title: "Categorías",
      url: "/categorias",
      icon: TagIcon,
    },
    {
      title: "Precios",
      url: "/precios",
      icon: DollarSignIcon,
    },
    {
      title: "Clientes",
      url: "/clientes",
      icon: UsersIcon,
    },
    {
      title: "Stocks",
      url: "/stocks",
      icon: BarChartIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
 
              <span className="flex items-center gap-2">
                <LayoutDashboardIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Admin Mi Tienda</span>
              </span>

          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  )
}
