'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface ContactSubmission {
  id: string
  created_at: string
  name: string
  email: string
  phone: string
  message: string
  status: string
}

interface Product {
  id: string
  created_at: string
  name: string
  description: string
  price: number
  status: string
}

export default function Dashboard() {
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchUserData() {
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          console.error('Error fetching user:', userError)
          return
        }

        if (!user?.email) {
          console.error('No user email found')
          return
        }

        // Log user details
        console.log('User Details:', {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          user_metadata: user.user_metadata,
          app_metadata: user.app_metadata
        })

        // Fetch contact submissions
        const { data: submissions, error: submissionsError } = await supabase
          .from('seoaudit_contactsubmission')
          .select('*')
          .eq('email', user.email)

        if (submissionsError) {
          console.error('Error fetching submissions:', submissionsError)
        } else {
          console.log('Contact Submissions:', submissions)
          setContactSubmissions(submissions || [])
        }

        // Fetch products
        const { data: productData, error: productsError } = await supabase
          .from('seoaudit_product')
          .select('*')
          .eq('email', user.email)

        if (productsError) {
          console.error('Error fetching products:', productsError)
        } else {
          console.log('Products:', productData)
          setProducts(productData || [])
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Contact Submissions Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Contact Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contactSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>{new Date(submission.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{submission.name}</TableCell>
                  <TableCell>{submission.email}</TableCell>
                  <TableCell>{submission.phone}</TableCell>
                  <TableCell>{submission.message}</TableCell>
                  <TableCell>{submission.status}</TableCell>
                </TableRow>
              ))}
              {contactSubmissions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">No submissions found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Products Section */}
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{new Date(product.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{product.status}</TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No products found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}