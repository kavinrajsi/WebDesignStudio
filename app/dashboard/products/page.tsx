'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'

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
  gst_number?: string
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
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchUserData() {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          console.error('Error fetching user:', userError)
          return
        }

        if (!user?.email) {
          console.error('No user email found')
          return
        }

        const { data: productData, error: productsError } = await supabase
          .from('seoaudit_product')
          .select('*')
          .eq('email', user.email)

        if (productsError) {
          console.error('Error fetching products:', productsError)
        } else {
          // Add GST number to each product
          const productsWithGST = productData?.map(product => ({
            ...product,
            gst_number: '33AAFCP8848R1ZI' // Add GST number to each product
          })) || []
          setProducts(productsWithGST)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [supabase])

  const handleViewInvoice = (orderId: string, paymentId: string, gstNumber: string) => {
    window.open(`/dashboard/invoice?orderId=${orderId}&paymentId=${paymentId}&gstNumber=${gstNumber}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Orders</CardTitle>
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
            {products.map((product) => (
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
                      onClick={() => handleViewInvoice(product.id, product.payment_id, product.gst_number || '33AAFCP8848R1ZI')}
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Invoice
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
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