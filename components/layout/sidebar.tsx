"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconBraces,
  IconDatabase,
  IconFileCode,
  IconAdjustments,
  IconCode
} from "@tabler/icons-react"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar"

const navigation = [
  { name: "JSON Viewer", href: "/json-viewer", icon: IconBraces },
  { name: "SQL Placeholder", href: "/sql-placeholder", icon: IconDatabase },
  { name: "Properties Converter", href: "/properties-converter", icon: IconAdjustments },
  { name: "Record to Protobuf", href: "/record-protobuf", icon: IconFileCode },
]

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenuButton size="lg" asChild>
            <Link href="/">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm">
                <IconCode className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">CodelessShipMore</span>
                <span className="truncate text-xs text-muted-foreground">Dev Tools</span>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Developer Tools</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={pathname === item.href}>
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center justify-center">
            <ThemeToggle />
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1" />
          {/* You can add additional header items here if needed */}
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}