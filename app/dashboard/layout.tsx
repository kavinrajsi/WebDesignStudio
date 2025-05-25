'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  LayoutDashboard,
  FileText,
  Send,
  Users,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const pathname = usePathname()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          window.location.href = '/auth/signin'
          return
        }

        const { data: profile, error: profileError } = await supabase
          .from('seoaudit_profile')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) throw profileError

        setIsAdmin(profile.role === 'admin')
      } catch (err) {
        console.error('Error fetching user:', err)
      }
    }

    fetchUser()
  }, [supabase])

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Products',
      href: '/dashboard/products',
      icon: FileText,
    },
    {
      name: 'Contacts',
      href: '/dashboard/contacts',
      icon: Send,
    },
    ...(isAdmin ? [{
      name: 'Customers',
      href: '/dashboard/customers',
      icon: Users,
    }] : []),
    {
      name: 'Settings',
      href: '/dashboard/profile',
      icon: Settings,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div
        className={cn(
          'fixed inset-0 z-40 lg:hidden',
          sidebarOpen ? 'block' : 'hidden'
        )}
      >
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <Image
                src="/assets/madarth-logo.png"
                alt="Search Madarth®"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center rounded-md px-2 py-2 text-sm font-medium',
                  pathname === item.href
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  isCollapsed && 'justify-center'
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5 flex-shrink-0',
                    pathname === item.href
                      ? 'text-gray-500'
                      : 'text-gray-400 group-hover:text-gray-500',
                    !isCollapsed && 'mr-3'
                  )}
                />
                {!isCollapsed && item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={cn(
        'hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300',
        isCollapsed ? 'lg:w-20' : 'lg:w-64'
      )}>
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            {!isCollapsed && (
              <Image
                src="/assets/madarth-logo.png"
                alt="Search Madarth®"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </Button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center rounded-md px-2 py-2 text-sm font-medium',
                  pathname === item.href
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  isCollapsed && 'justify-center'
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5 flex-shrink-0',
                    pathname === item.href
                      ? 'text-gray-500'
                      : 'text-gray-400 group-hover:text-gray-500',
                    !isCollapsed && 'mr-3'
                  )}
                />
                {!isCollapsed && item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className={cn(
        'transition-all duration-300',
        isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      )}>
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1">
              <h1 className="text-2xl font-semibold text-gray-900 my-auto">
                {navigation.find((item) => item.href === pathname)?.name || 'Dashboard'}
              </h1>
            </div>
          </div>
        </div>

        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 