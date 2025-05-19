'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

interface ContactSubmission {
  id: string
  created_at: string
  name: string
  email: string
  phone: string
  website: string
  message: string
}

interface Product {
  id: string
  created_at: string
  name: string
  email: string
  phone: string
  website: string
  payment_status: string
  order_id: string
}

export default function DashboardPage() {
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user?.email) return

        // Fetch user profile to check role
        const { data: profile } = await supabase
          .from('seoaudit_profile')
          .select('role')
          .eq('id', user.id)
          .single()
        
        console.log('Dashboard Overview - User Role:', profile?.role || 'No role found')

        // Fetch contact submissions
        const { data: submissions } = await supabase
          .from('seoaudit_contactsubmission')
          .select('*')
          .eq('email', user.email)

        // Fetch products
        const { data: productData } = await supabase
          .from('seoaudit_product')
          .select('*')
          .eq('email', user.email)

        setContactSubmissions(submissions || [])
        setProducts(productData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer" 
          onClick={() => router.push('/dashboard/products')}
        >
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">View all your product orders and their status</p>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-500">Total Orders: {products.length}</p>
              <p className="text-sm text-gray-500">
                Completed Orders: {products.filter(p => p.payment_status === 'completed').length}
              </p>
              <p className="text-sm text-gray-500">
                Pending Orders: {products.filter(p => p.payment_status !== 'completed').length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer" 
          onClick={() => router.push('/dashboard/contacts')}
        >
          <CardHeader>
            <CardTitle>Contact Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">View all your contact form submissions</p>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-500">Total Submissions: {contactSubmissions.length}</p>
              <p className="text-sm text-gray-500">
                Today&apos;s Submissions: {contactSubmissions.filter(s => {
                  const today = new Date()
                  const submissionDate = new Date(s.created_at)
                  return submissionDate.toDateString() === today.toDateString()
                }).length}
              </p>
              <p className="text-sm text-gray-500">
                This Week&apos;s Submissions: {contactSubmissions.filter(s => {
                  const today = new Date()
                  const submissionDate = new Date(s.created_at)
                  const diffTime = Math.abs(today.getTime() - submissionDate.getTime())
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                  return diffDays <= 7
                }).length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}