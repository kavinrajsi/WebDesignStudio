'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'

interface Profile {
  id: string
  email: string
  role: string
  created_at: string
  updated_at: string
  last_sign_in: string
  full_name: string
  phone: string
  company: string
  website: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    company: '',
    website: ''
  })
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/login')
          return
        }

        const { data: profile, error: profileError } = await supabase
          .from('seoaudit_profile')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) throw profileError

        setProfile(profile)
        setFormData({
          full_name: profile.full_name || '',
          phone: profile.phone || '',
          company: profile.company || '',
          website: profile.website || ''
        })
      } catch (err) {
        console.error('Error fetching profile:', err)
        setError('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [supabase, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('No user found')

      const { error: updateError } = await supabase
        .from('seoaudit_profile')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          company: formData.company,
          website: formData.website,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      setIsEditing(false)
      // Refresh profile data
      const { data: updatedProfile } = await supabase
        .from('seoaudit_profile')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(updatedProfile)
    } catch (err) {
      console.error('Error updating profile:', err)
      setError('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Profile Information</CardTitle>
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Enter your company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="Enter your website URL"
                />
              </div>
              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-500">Email</h3>
                <p className="mt-1">{profile?.email}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Full Name</h3>
                <p className="mt-1">{profile?.full_name || 'Not provided'}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Phone Number</h3>
                <p className="mt-1">{formData.phone || 'Not provided'}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Company Name</h3>
                <p className="mt-1">{formData.company || 'Not provided'}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Website</h3>
                <p className="mt-1">{formData.website || 'Not provided'}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Member Since</h3>
                <p className="mt-1">
                  {new Date(profile?.created_at || '').toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Last Sign In</h3>
                <p className="mt-1">
                  {profile?.last_sign_in ? new Date(profile.last_sign_in).toLocaleString() : 'Not available'}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Last Updated</h3>
                <p className="mt-1">
                  {profile?.updated_at ? new Date(profile.updated_at).toLocaleString() : 'Not available'}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 