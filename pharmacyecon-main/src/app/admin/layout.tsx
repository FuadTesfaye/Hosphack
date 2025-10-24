
'use client'

import { SidebarProvider, Sidebar, SidebarHeader, SidebarTrigger, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset } from '@/components/ui/sidebar'
import { Stethoscope, LayoutDashboard, Pill, ShoppingCart, LogOut, Store, FileText, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChatSidebar } from '@/components/admin/chat-sidebar'
import { ThemeToggle } from '@/components/theme-toggle'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { href: '/admin', label: 'Overview', icon: <LayoutDashboard /> },
    { href: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
    { href: '/admin/medicines', label: 'Medicines', icon: <Pill /> },
    { href: '/admin/orders', label: 'Orders', icon: <ShoppingCart /> },
    { href: '/admin/pharmacies', label: 'Pharmacies', icon: <Store /> },
    { href: '/admin/license-requests', label: 'License Requests', icon: <FileText /> },
    { href: '/admin/prescription-uploads', label: 'Prescription Uploads', icon: <FileText /> },
  ]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500">
        <Sidebar className="border-r border-blue-200/50 dark:border-slate-700/50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-xl">
          <SidebarHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-green-600/20 animate-gradient"></div>
            <div className="relative z-10 flex items-center justify-between p-4">
              <Link href="/admin" className="flex items-center gap-3 hover:scale-105 transition-transform duration-300">
                <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                  <Stethoscope className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="font-bold text-xl bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">Pharmacy Econ</span>
                  <p className="text-xs text-blue-100 opacity-90">Admin Dashboard</p>
                </div>
              </Link>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <SidebarTrigger className="text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-300" />
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="flex-grow p-4 space-y-2">
            <SidebarMenu className="space-y-2">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label }}
                    className={`rounded-xl transition-all duration-300 hover:scale-105 ${
                      pathname === item.href 
                        ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 text-white shadow-lg transform scale-105' 
                        : 'hover:bg-blue-50 dark:hover:bg-slate-800 hover:shadow-md'
                    }`}
                  >
                    <Link href={item.href} className="flex items-center gap-3 p-3">
                      <div className={`p-2 rounded-lg transition-all duration-300 ${
                        pathname === item.href 
                          ? 'bg-white/20 text-white' 
                          : 'bg-blue-100 dark:bg-slate-700 text-blue-600 dark:text-blue-400'
                      }`}>
                        {item.icon}
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <div className="p-4 border-t border-blue-200/50 dark:border-slate-700/50">
            <SidebarMenu>
              <SidebarMenuItem>
                 <SidebarMenuButton asChild tooltip={{ children: 'Logout' }} className="rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 hover:scale-105">
                  <Link href="/" className="flex items-center gap-3 p-3">
                      <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                        <LogOut className="h-4 w-4" />
                      </div>
                      <span className="font-medium">Logout</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </Sidebar>
        <SidebarInset className="flex-1 relative w-full">
          <div className="min-h-screen w-full max-w-none p-6 lg:p-8">
            <div className="w-full max-w-none mx-auto">
              {children}
            </div>
          </div>
          <ChatSidebar />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
