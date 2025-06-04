import { createClient } from '@supabase/supabase-js'
import { use } from 'react'
import { PrintButton } from './PrintButton'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'

interface InvoiceData {
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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getInvoiceData(id: string): Promise<InvoiceData> {
  const { data, error } = await supabase
    .from('seoaudit_product')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error

  return data
}

export default function PublicInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const invoiceData = use(getInvoiceData(id))

  return (
    <div className="min-h-screen bg-gray-50 py-30 md:py-30 px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8" id="invoice-container">
        <PrintButton />

        {/* Invoice Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="mb-4">
              <Image
                src="/assets/madarth-logo.png"
                alt="Search Madarth®"
                width={180}
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-gray-600">
              4, Alamelu Manga Puram Rd,<br />
              Saradapuram, Mylapore,<br />
              Chennai, Tamil Nadu 600004<br />
              India<br />
              GST Number: 33AAFCP8848R1ZI
            </p>
          </div>
          <div className="text-right">
            <h1 className="text-[28px] font-bold">INVOICE</h1>
            <p className="text-gray-600 mb-2">#{invoiceData.id}</p>
            <div className={`px-3 py-1 rounded text-sm inline-block ${
              invoiceData.payment_status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {invoiceData.payment_status.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Bill To:</h3>
            <p className="font-medium">{invoiceData.name}</p>
            <p className="text-gray-600">{invoiceData.email}</p>
            <p className="text-gray-600">{invoiceData.phone}</p>
            {invoiceData.website && (
              <span className="text-gray-600">{invoiceData.website}</span>
            )}
          </div>
          <div className="text-right">
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Invoice Date:</span>
              <span className="ml-2">{new Date(invoiceData.created_at).toLocaleDateString()}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Payment ID:</span>
              <span className="ml-2">{invoiceData.payment_id}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Order ID:</span>
              <span className="ml-2">{invoiceData.order_id}</span>
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="border rounded-lg overflow-hidden mb-8">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="py-3 px-4 font-semibold text-gray-700">Description</th>
                <th className="py-3 px-4 font-semibold text-gray-700 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-4 px-4">
                  <p className="font-medium">SEO Audit Package</p>
                  <p className="text-gray-500 text-sm">Comprehensive SEO Audit with Recommendations</p>
                  {invoiceData.website && (
                    <p className="text-gray-500 text-sm mt-1">Website: {invoiceData.website}</p>
                  )}
                </td>
                <td className="py-4 px-4 text-right">₹899.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Invoice Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="flex justify-between py-2">
              <span className="font-medium text-gray-700">Subtotal:</span>
              <span>₹899.00</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-medium text-gray-700">GST (18%):</span>
              <span>₹161.46</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between py-2 font-bold">
              <span>Total:</span>
              <span>₹1,026.60</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-700 mb-2">Notes:</h3>
          <p className="text-gray-600">
            Thank you for your business! Your SEO audit report will be delivered to your email within 48 hours.
          </p>
        </div>
      </div>
    </div>
  )
} 