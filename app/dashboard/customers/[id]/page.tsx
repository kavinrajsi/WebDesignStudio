'use client'

import { useEffect, useState, use } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'

interface Profile {
  id: string
  email: string
  role: string
  created_at: string
  updated_at: string
}

interface Product {
  id: string
  name: string
  email: string
  phone: string
  website: string
  payment_status: string
  created_at: string
  gst_number?: string
}

interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string
  message: string
  created_at: string
}

export default function CustomerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/auth/signin')
          return
        }

        const { data: adminProfile, error: adminError } = await supabase
          .from('seoaudit_profile')
          .select('*')
          .eq('id', user.id)
          .single()

        if (adminError) throw adminError

        if (adminProfile.role !== 'admin') {
          router.push('/dashboard')
          return
        }

        // Fetch customer profile
        const { data: profile, error: profileError } = await supabase
          .from('seoaudit_profile')
          .select('*')
          .eq('id', id)
          .single()

        if (profileError) throw profileError
        setProfile(profile)

        // Fetch customer products
        const { data: products, error: productsError } = await supabase
          .from('seoaudit_product')
          .select('*')
          .eq('email', profile.email)
          .order('created_at', { ascending: false })

        if (productsError) throw productsError
        setProducts(products)

        // Fetch customer contact submissions
        const { data: submissions, error: submissionsError } = await supabase
          .from('seoaudit_contactsubmission')
          .select('*')
          .eq('email', profile.email)
          .order('created_at', { ascending: false })

        if (submissionsError) throw submissionsError
        setContactSubmissions(submissions)
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase, router, id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-500">Customer not found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{profile.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Role</dt>
              <dd className="mt-1 text-sm text-gray-900">{profile.role}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(profile.created_at).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(profile.updated_at).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="contacts">Contact Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>GST Number</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.phone}</TableCell>
                      <TableCell>{product.website}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-sm ${
                          product.payment_status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {product.payment_status.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>{product.gst_number || '-'}</TableCell>
                      <TableCell>
                        {new Date(product.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>Contact Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contactSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>{submission.name}</TableCell>
                      <TableCell>{submission.phone}</TableCell>
                      <TableCell className="max-w-md truncate">
                        {submission.message}
                      </TableCell>
                      <TableCell>
                        {new Date(submission.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Product Details Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Name</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedProduct.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Email</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedProduct.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedProduct.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Website</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedProduct.website}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Payment Status</h4>
                  <p className="mt-1">
                    <span className={`px-2 py-1 rounded text-sm ${
                      selectedProduct.payment_status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedProduct.payment_status.toUpperCase()}
                    </span>
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">GST Number</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedProduct.gst_number || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Created At</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedProduct.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Contact Submission Details Modal */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Submission Details</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Name</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedSubmission.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Email</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedSubmission.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedSubmission.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Created At</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedSubmission.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-gray-500">Message</h4>
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                    {selectedSubmission.message}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 