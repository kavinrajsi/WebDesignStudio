import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import logoSvg from "@/assets/logo.svg";

// Interface for invoice data
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
  packageName: string;
  status: "paid" | "pending" | "failed";
}

export default function Invoice() {
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [_, setLocation] = useLocation();
  
  // Function to extract payment ID from URL
  const getPaymentIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('payment_id');
  };
  
  useEffect(() => {
    const fetchInvoice = async () => {
      const paymentId = getPaymentIdFromUrl();
      
      if (!paymentId) {
        setError("No payment ID provided");
        setLoading(false);
        return;
      }
      
      try {
        // In a real application, this would fetch from the server
        // For demo, we'll create a mock invoice based on the payment ID
        setTimeout(() => {
          // Mock data for demonstration
          const mockInvoice: InvoiceData = {
            id: `INV-${Math.floor(Math.random() * 1000000)}`,
            razorpayOrderId: `order_${Math.random().toString(36).substring(2, 15)}`,
            razorpayPaymentId: paymentId || `pay_${Math.random().toString(36).substring(2, 15)}`,
            purchaseDate: new Date().toISOString().split('T')[0],
            amount: 870,
            tax: 156.6, // 18% GST
            total: 1026.6,
            customerName: "John Doe",
            customerEmail: "john.doe@example.com",
            customerPhone: "+91 98765 43210",
            packageName: "SEO Audit",
            status: "paid"
          };
          
          setInvoice(mockInvoice);
          setLoading(false);
        }, 1000); // Simulating network delay
      } catch (err) {
        setError("Failed to fetch invoice data");
        setLoading(false);
      }
    };
    
    fetchInvoice();
  }, []);
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleDownloadPDF = () => {
    // In a real application, this would generate and download a PDF
    // For demo purposes, we'll just show an alert
    alert("PDF Download functionality would be implemented here.");
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="print:hidden">
        <Navbar />
      </div>
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B2F74D]"></div>
            </div>
          ) : error ? (
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle className="text-red-500">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{error}</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setLocation("/")} variant="outline">Return to Home</Button>
              </CardFooter>
            </Card>
          ) : invoice ? (
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8" id="invoice-container">
              {/* Invoice Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <img src={logoSvg} alt="Growth Insight Logo" className="h-6 mb-4" />
                  <p className="text-gray-600">
                    4, Alamelu Manga Puram Rd,<br />
                    Saradapuram, Mylapore,<br />
                    Chennai, Tamil Nadu 600004<br />
                    India
                  </p>
                </div>
                <div className="text-right">
                  <h1 className="text-2xl font-bold">INVOICE</h1>
                  <p className="text-gray-600 mb-2">#{invoice.id}</p>
                  <div className="bg-green-100 text-green-800 font-semibold px-3 py-1 rounded text-sm inline-block">
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
                  <Icon name="printer" className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button onClick={handleDownloadPDF} className="flex items-center bg-[#B2F74D] text-[#0F3529] hover:bg-[#0F3529] hover:text-[#B2F74D] hover:border hover:border-[#B2F74D]">
                  <Icon name="download" className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </main>
      
      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}