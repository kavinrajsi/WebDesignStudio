'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { initHyperDX } from '@/lib/hyperdx'
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard')

  useEffect(() => {
    // Initialize HyperDX only on the client side
    if (typeof window !== 'undefined') {
      initHyperDX()
      
      // Initialize Microsoft Clarity
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://www.clarity.ms/tag/rtmevkko20';
      document.head.appendChild(script);
    }
  }, [])

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {!isDashboard && <Navbar />}
        <div className="flex flex-col min-h-screen">
          <main>{children}</main>
        </div>
        {!isDashboard && <Footer />}
      </body>
    </html>
  )
}
