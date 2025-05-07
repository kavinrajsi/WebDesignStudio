import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-16">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <h1 className="text-[28px] font-bold text-gray-900">404 Page Not Found</h1>
            </div>
            <p className="mt-4 text-sm text-gray-600 mb-6">
              The page you are looking for doesn't exist or has been moved.
            </p>
            <Link href="/">
              <a className="inline-block bg-[#0F3529] text-white font-semibold px-4 py-2 rounded-md hover:bg-opacity-90 transition-all">
                Go Back Home
              </a>
            </Link>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
