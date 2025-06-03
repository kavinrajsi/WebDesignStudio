'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import "./globals.css";

// Add Google Analytics type declarations
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (command: string, ...args: unknown[]) => void;
  }
}

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
    // Initialize scripts only on the client side
    if (typeof window !== 'undefined') {
      // Initialize Microsoft Clarity
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://www.clarity.ms/tag/rtmevkko20';
      document.head.appendChild(script);

      // Initialize Google Analytics
      const gtagScript = document.createElement('script');
      gtagScript.async = true;
      gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-WR6M7J977M';
      document.head.appendChild(gtagScript);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      gtag('js', new Date());
      gtag('config', 'G-WR6M7J977M');
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
