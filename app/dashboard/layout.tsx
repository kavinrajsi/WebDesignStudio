'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string>('')
  const supabase = createClientComponentClient()

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/auth/signin')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setUserEmail(user.email)
      }
    }
    fetchUser()
  }, [supabase])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-[#0F3529]">Dashboard</h1>
              <nav className="hidden md:flex space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/dashboard')}
                  className="text-[#0F3529] hover:text-[#CADB3F]"
                >
                  Overview
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push('/dashboard/products')}
                  className="text-[#0F3529] hover:text-[#CADB3F]"
                >
                  Products
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push('/dashboard/contacts')}
                  className="text-[#0F3529] hover:text-[#CADB3F]"
                >
                  Contacts
                </Button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {userEmail}
              </span>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-[#0F3529] hover:text-[#CADB3F]"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
} 