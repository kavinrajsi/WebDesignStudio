'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

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
  const [loading, setLoading] = useState(true)
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

        const { data: submissions, error: submissionsError } = await supabase
          .from('seoaudit_contactsubmission')
          .select('*')
          .eq('email', user.email)

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
        <CardTitle>Contact Form Submissions</CardTitle>
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
            {contactSubmissions.map((submission) => (
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
            {contactSubmissions.length === 0 && (
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