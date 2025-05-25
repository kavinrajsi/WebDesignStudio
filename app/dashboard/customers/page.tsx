'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, Mail, Phone, Globe, Calendar, Shield } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

interface Profile {
  id: string
  email: string
  role: string
  created_at: string
  updated_at: string
  phone?: string
  website?: string
  company_name?: string
  address?: string
  gst_number?: string
}

interface CustomerStats {
  totalProducts: number
  totalSubmissions: number
  lastActivity: string
}

export default function CustomersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState<Profile | null>(null)
  const [customerStats, setCustomerStats] = useState<Record<string, CustomerStats>>({})
  const [userRole, setUserRole] = useState<string>('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/auth/signin')
          return
        }

        const { data: profile, error: profileError } = await supabase
          .from('seoaudit_profile')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) throw profileError

        setUserRole(profile.role)

        // If user is not admin, only fetch their own profile
        if (profile.role !== 'admin') {
          setProfiles([profile])
          // Fetch stats for the user
          const [products, submissions] = await Promise.all([
            supabase
              .from('seoaudit_product')
              .select('created_at')
              .eq('email', profile.email),
            supabase
              .from('seoaudit_contactsubmission')
              .select('created_at')
              .eq('email', profile.email)
          ])

          const allDates = [
            ...(products.data?.map(p => new Date(p.created_at)) || []),
            ...(submissions.data?.map(s => new Date(s.created_at)) || [])
          ]

          setCustomerStats({
            [profile.id]: {
              totalProducts: products.data?.length || 0,
              totalSubmissions: submissions.data?.length || 0,
              lastActivity: allDates.length > 0 
                ? new Date(Math.max(...allDates.map(d => d.getTime()))).toISOString()
                : profile.created_at
            }
          })
        } else {
          // Admin: fetch all profiles
          const { data: profiles, error: profilesError } = await supabase
            .from('seoaudit_profile')
            .select('*')
            .order('created_at', { ascending: false })

          if (profilesError) throw profilesError

          setProfiles(profiles)

          // Fetch stats for each customer
          const stats: Record<string, CustomerStats> = {}
          for (const profile of profiles) {
            const [products, submissions] = await Promise.all([
              supabase
                .from('seoaudit_product')
                .select('created_at')
                .eq('email', profile.email),
              supabase
                .from('seoaudit_contactsubmission')
                .select('created_at')
                .eq('email', profile.email)
            ])

            const allDates = [
              ...(products.data?.map(p => new Date(p.created_at)) || []),
              ...(submissions.data?.map(s => new Date(s.created_at)) || [])
            ]

            stats[profile.id] = {
              totalProducts: products.data?.length || 0,
              totalSubmissions: submissions.data?.length || 0,
              lastActivity: allDates.length > 0 
                ? new Date(Math.max(...allDates.map(d => d.getTime()))).toISOString()
                : profile.created_at
            }
          }

          setCustomerStats(stats)
        }
      } catch (err) {
        console.error('Error fetching profiles:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfiles()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Customers</CardTitle>
        <Badge variant={userRole === 'admin' ? 'default' : 'secondary'} className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          {userRole.toUpperCase()}
        </Badge>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Stats</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell>
                  <div className="font-medium">{profile.company_name || 'N/A'}</div>
                  {profile.gst_number && (
                    <div className="text-sm text-gray-500">GST: {profile.gst_number}</div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2" />
                      {profile.email}
                    </div>
                    {profile.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2" />
                        {profile.phone}
                      </div>
                    )}
                    {profile.website && (
                      <div className="flex items-center text-sm">
                        <Globe className="h-4 w-4 mr-2" />
                        {profile.website}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                    {profile.role.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">
                      Products: {customerStats[profile.id]?.totalProducts || 0}
                    </div>
                    <div className="text-sm">
                      Submissions: {customerStats[profile.id]?.totalSubmissions || 0}
                    </div>
                    <div className="text-sm text-gray-500">
                      Last Activity: {new Date(customerStats[profile.id]?.lastActivity || profile.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(profile.created_at).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedCustomer(profile)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {userRole === 'admin' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/dashboard/customers/${profile.id}`)}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {/* Customer Details Modal */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Company Name</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedCustomer.company_name || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">GST Number</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedCustomer.gst_number || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Email</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedCustomer.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedCustomer.phone || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Website</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedCustomer.website || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Role</h4>
                    <Badge variant={selectedCustomer.role === 'admin' ? 'default' : 'secondary'}>
                      {selectedCustomer.role.toUpperCase()}
                    </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Address</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedCustomer.address || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Created At</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedCustomer.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedCustomer.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Activity Stats</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-500">Total Products</h5>
                    <p className="mt-1 text-sm text-gray-900">
                      {customerStats[selectedCustomer.id]?.totalProducts || 0}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-500">Total Submissions</h5>
                    <p className="mt-1 text-sm text-gray-900">
                      {customerStats[selectedCustomer.id]?.totalSubmissions || 0}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-500">Last Activity</h5>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(customerStats[selectedCustomer.id]?.lastActivity || selectedCustomer.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
} 