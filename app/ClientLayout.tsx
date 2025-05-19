'use client'

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname === '/dashboard';

  return (
    <>
      {!isDashboard && <Navbar />}
      <div className="flex flex-col min-h-screen">
        <main>{children}</main>
      </div>
      {!isDashboard && <Footer />}
    </>
  );
} 