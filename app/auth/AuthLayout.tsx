'use client'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="flex min-h-screen">
        {/* Left side - Content */}
        <div className="hidden lg:block relative w-0 flex-1">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600">
            <div className="absolute inset-0 bg-opacity-75 flex flex-col justify-center px-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Welcome to SEO Audit Solutions
              </h2>
              <p className="text-xl text-white/90">
                Transform your website&apos;s performance with our expert SEO audit services
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-2 text-center text-sm text-gray-600">
                  {subtitle}
                </p>
              )}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
} 