"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Printer } from "lucide-react";
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface InvoiceData {
  id: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  purchaseDate: string;
  amount: number;
  tax: number;
  total: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  website?: string;
  packageName: string;
  status: "paid" | "pending" | "failed";
  gstNumber: string;
}

export default function InvoicePage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      const orderId = searchParams.get('orderId');
      const paymentId = searchParams.get('paymentId');
      const gstNumber = searchParams.get('gstNumber');

      if (!orderId || !paymentId) {
        setError("Missing order ID or payment ID");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('seoaudit_product')
          .select('*')
          .eq('id', orderId)
          .eq('payment_id', paymentId)
          .single();

        if (error) throw error;

        if (data) {
          setInvoice({
            id: data.id,
            razorpayOrderId: data.order_id,
            razorpayPaymentId: data.payment_id,
            purchaseDate: new Date(data.created_at).toLocaleDateString(),
            amount: 870, // Base amount
            tax: 156.6, // 18% GST
            total: 1026.6, // Total with GST
            customerName: data.name,
            customerEmail: data.email,
            customerPhone: data.phone,
            website: data.website,
            packageName: "SEO Audit Package",
            status: data.payment_status === 'completed' ? 'paid' : 'pending',
            gstNumber: gstNumber || '33AAFCP8848R1ZI' // Use GST number from URL or fallback to default
          });
        } else {
          setError("Invoice not found");
        }
      } catch (err) {
        console.error('Error fetching invoice:', err);
        setError("Failed to fetch invoice data");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [searchParams]);

  const handlePrint = () => {
    // Add print-specific styles
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        #invoice-container, #invoice-container * {
          visibility: visible;
        }
        #invoice-container {
          position: absolute;
          left: 50%;
          top: 0;
          transform: translateX(-50%);
          width: 100%;
          max-width: 800px;
          box-shadow: none !important;
          border: none !important;
        }
        .print\\:hidden {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    window.print();
    // Remove the style after printing
    document.head.removeChild(style);
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#CADB3F]"></div>
        </div>
      ) : error ? (
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      ) : invoice ? (
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8" id="invoice-container">
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
                <span className="font-medium">GST No: {invoice.gstNumber}</span>
              </p>
            </div>
            <div className="text-right">
              <h1 className="text-[28px] font-bold">INVOICE</h1>
              <p className="text-gray-600 mb-2">#{invoice.id}</p>
              <div className={`px-3 py-1 rounded text-sm inline-block ${
                invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {invoice.status.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Bill To:</h3>
              {invoice.customerName && <p className="font-medium">{invoice.customerName}</p>}
              {invoice.customerEmail && <p className="text-gray-600">{invoice.customerEmail}</p>}
              {invoice.customerPhone && <p className="text-gray-600">{invoice.customerPhone}</p>}
            </div>
            <div className="text-right">
              <div className="mb-2">
                <span className="font-semibold text-gray-700">Invoice Date:</span>
                <span className="ml-2">{invoice.purchaseDate}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-700">Payment ID:</span>
                <span className="ml-2">{invoice.razorpayPaymentId}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Order ID:</span>
                <span className="ml-2">{invoice.razorpayOrderId}</span>
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
                    <p className="font-medium">{invoice.packageName}</p>
                    <p className="text-gray-500 text-sm">Comprehensive SEO Audit with Recommendations</p>
                    {invoice.website && (
                      <p className="text-gray-500 text-sm mt-1">Website: {invoice.website}</p>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">₹{invoice.amount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Invoice Summary */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span className="font-medium text-gray-700">Subtotal:</span>
                <span>₹{invoice.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium text-gray-700">GST (18%):</span>
                <span>₹{invoice.tax.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between py-2 font-bold">
                <span>Total:</span>
                <span>₹{invoice.total.toFixed(2)}</span>
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

          {/* Invoice Actions */}
          <div className="flex justify-end space-x-4 print:hidden">
            <Button variant="outline" onClick={handlePrint} className="flex items-center">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
} 