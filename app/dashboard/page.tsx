'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { AuthError } from '@supabase/supabase-js'

const LoadingState = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-xl">Loading...</div>
  </div>
)

const ErrorState = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-xl text-red-500">{message}</div>
  </div>
)

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>('')

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true)
      
      // Check if user is authenticated
      const { data: { session }, error: authError } = await supabase.auth.getSession()
      
      if (authError) throw authError
      
      if (!session) {
        toast.error('Please sign in to access the dashboard')
        router.push('/auth/signin')
        return
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', session.user.id)
        .single()

      if (profileError) {
        console.error('Error fetching profile:', profileError)
        
        // If profile doesn't exist, create it
        if (profileError.code === 'PGRST116') {
          const { error: createError } = await supabase
            .from('profiles')
            .insert({
              id: session.user.id,
              email: session.user.email,
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              last_sign_in: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })

          if (createError) {
            console.error('Error creating profile:', createError)
            setUserName(session.user.email?.split('@')[0] || 'User')
          } else {
            setUserName(session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User')
          }
        } else {
          setUserName(session.user.email?.split('@')[0] || 'User')
        }
      } else {
        setUserName(profile?.full_name || session.user.email?.split('@')[0] || 'User')
      }
    } catch (err) {
      console.error('Dashboard error:', err)
      if (err instanceof AuthError) {
        setError(err.message)
        toast.error('Authentication error. Please sign in again.')
        router.push('/auth/signin')
      } else {
        setError('Failed to fetch data')
        toast.error('Failed to fetch data. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const handleSignOut = async () => {
    try {
      setLoading(true)
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Sign out error:', error)
        throw new Error(error.message)
      }
      
      // Show success message
      toast.success('Signed out successfully')
      
      // Redirect to sign in page
      router.push('/auth/signin')
    } catch (err) {
      console.error('Sign out error:', err instanceof Error ? err.message : 'Unknown error')
      toast.error('Failed to sign out. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} />

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome, {userName}!</h1>
        <button
          onClick={handleSignOut}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#CADB3F] text-[#0F3529] font-semibold hover:bg-[#0F3529] hover:text-[#CADB3F] hover:border hover:border-[#0F3529] transition-all cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}