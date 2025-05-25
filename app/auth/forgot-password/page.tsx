'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import AuthLayout from '../AuthLayout'

export default function ForgotPassword() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError('Please enter your email address')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    try {
      setLoading(true)
      setError('')
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) throw error

      toast.success('Password reset instructions sent to your email')
      router.push('/auth/signin')
    } catch (error) {
      console.error('Reset password error:', error)
      setError('Failed to send reset instructions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout 
      title="Reset your password"
      subtitle="Enter your email address and we'll send you instructions to reset your password"
    >
      <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              className={`block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (error) setError('')
              }}
            />
            {error && (
              <div className="mt-2">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}
          </div>
        </div>

        <div>
        <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white cursor-pointer ${
              loading 
                ? 'bg-[#0f3529]/70 cursor-not-allowed' 
                : 'bg-[#0f3529] hover:bg-[#1a4d3d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0f3529]'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending instructions...
              </>
            ) : (
              'Send reset instructions'
            )}
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link href="/auth/signin" className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
} 