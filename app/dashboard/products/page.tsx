'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { FileText, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

interface Product {
  id: string
  created_at: string
  name: string
  email: string
  phone: string
  website: string
  payment_status: string
  order_id: string
  payment_id: string
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/auth/signin')
          return
        }

        const { data: profile } = await supabase
          .from('seoaudit_profile')
          .select('role')
          .eq('id', user.id)
          .single()

        console.log('Products Page - User Role:', profile?.role || 'No role found')
        setIsAdmin(profile?.role === 'admin')

        let query = supabase
          .from('seoaudit_product')
          .select('*')
          .order('created_at', { ascending: false })

        if (!isAdmin) {
          query = query.eq('email', user.email)
        }

        const { data: products, error: productsError } = await query

        if (productsError) throw productsError

        setProducts(products)
        setFilteredProducts(products)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [supabase, router, isAdmin])

  useEffect(() => {
    if (!products) return

    const filtered = products.filter(product => {
      const searchLower = searchQuery.toLowerCase()
      const name = product.name?.toLowerCase() || ''
      const email = product.email?.toLowerCase() || ''
      const website = product.website?.toLowerCase() || ''
      const orderId = product.order_id?.toLowerCase() || ''

      return (
        name.includes(searchLower) ||
        email.includes(searchLower) ||
        website.includes(searchLower) ||
        orderId.includes(searchLower)
      )
    })

    setFilteredProducts(filtered)
  }, [searchQuery, products])

  const handleViewInvoice = (orderId: string, paymentId: string) => {
    window.open(`/dashboard/invoice?orderId=${orderId}&paymentId=${paymentId}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Product Orders {isAdmin && '(All Orders)'}</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{formatDate(product.created_at)}</TableCell>
                <TableCell>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-500">{product.email}</div>
                  <div className="text-sm text-gray-500">{product.phone}</div>
                </TableCell>
                <TableCell>
                  <a 
                    href={product.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {product.website}
                  </a>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.payment_status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {product.payment_status}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {product.order_id}
                </TableCell>
                <TableCell>
                  {product.payment_status === 'completed' && product.payment_id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewInvoice(product.id, product.payment_id)}
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Invoice
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filteredProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">No products found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 