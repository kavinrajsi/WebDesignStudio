'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface ContactSubmission {
  id: string
  created_at: string
  name: string
  email: string
  phone: string
  website: string
  message: string
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export default function ContactsPage() {
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchUserData() {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          console.error('Error fetching user:', userError)
          return
        }

        if (!user?.email) {
          console.error('No user email found')
          return
        }

        // Fetch user profile to check role
        const { data: profile, error: profileError } = await supabase
          .from('seoaudit_profile')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) {
          console.error('Error fetching profile:', profileError)
          return
        }

        console.log('Contacts Page - User Role:', profile?.role || 'No role found')
        setIsAdmin(profile?.role === 'admin')

        // Fetch submissions based on role
        let query = supabase
          .from('seoaudit_contactsubmission')
          .select('*')
          .order('created_at', { ascending: false })
        
        // Only filter by email if user is not admin
        if (profile?.role !== 'admin') {
          query = query.eq('email', user.email)
        }

        const { data: submissions, error: submissionsError } = await query

        if (submissionsError) {
          console.error('Error fetching submissions:', submissionsError)
        } else {
          setContactSubmissions(submissions || [])
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [supabase])

  useEffect(() => {
    // Filter submissions based on search query
    const filtered = contactSubmissions.filter(submission => {
      if (!submission) return false
      
      const searchLower = searchQuery.toLowerCase()
      const name = (submission.name || '').toLowerCase()
      const email = (submission.email || '').toLowerCase()
      const website = (submission.website || '').toLowerCase()
      const message = (submission.message || '').toLowerCase()
      
      return name.includes(searchLower) ||
             email.includes(searchLower) ||
             website.includes(searchLower) ||
             message.includes(searchLower)
    })
    setFilteredSubmissions(filtered)
  }, [searchQuery, contactSubmissions])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Contact Form Submissions {isAdmin && '(All Submissions)'}</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search submissions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell>{formatDate(submission.created_at)}</TableCell>
                <TableCell>
                  <div className="font-medium">{submission.name}</div>
                  <div className="text-sm text-gray-500">{submission.email}</div>
                  <div className="text-sm text-gray-500">{submission.phone}</div>
                </TableCell>
                <TableCell>
                  <a 
                    href={submission.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {submission.website}
                  </a>
                </TableCell>
                <TableCell className="max-w-md">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {submission.message}
                  </p>
                </TableCell>
              </TableRow>
            ))}
            {filteredSubmissions.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">No submissions found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 