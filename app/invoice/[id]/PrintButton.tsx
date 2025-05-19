'use client'

import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'

export function PrintButton() {
  const handlePrint = () => {
    // Add print-specific styles
    const style = document.createElement('style')
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
    `
    document.head.appendChild(style)
    window.print()
    // Remove the style after printing
    document.head.removeChild(style)
  }

  return (
    <div className="flex justify-end mb-8 print:hidden">
      <Button onClick={handlePrint} className="flex items-center gap-2">
        <Printer className="h-4 w-4" />
        Print Invoice
      </Button>
    </div>
  )
} 