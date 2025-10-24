'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UserPlus, Store } from 'lucide-react'
import { getPharmacies } from '@/lib/api'
import type { Pharmacy } from '@/lib/types'

interface CustomerData {
  name: string
  email: string
  phone: string
  address: string
  message: string
  pharmacyId: string
  urgency: 'low' | 'medium' | 'high'
  type: 'inquiry' | 'complaint' | 'prescription' | 'order'
}

export default function CustomerRegisterPage() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState<CustomerData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    message: '',
    pharmacyId: '',
    urgency: 'medium',
    type: 'inquiry'
  })

  useEffect(() => {
    loadPharmacies()
  }, [])

  const loadPharmacies = async () => {
    try {
      const data = await getPharmacies()
      setPharmacies(data)
    } catch (error) {
      console.error('Error loading pharmacies:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const customerRequest = {
        ...formData,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        status: 'pending'
      }

      const existingRequests = JSON.parse(localStorage.getItem(`customer-requests-${formData.pharmacyId}`) || '[]')
      existingRequests.push(customerRequest)
      localStorage.setItem(`customer-requests-${formData.pharmacyId}`, JSON.stringify(existingRequests))

      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting request:', error)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Request Submitted!</h2>
            <p className="text-gray-600 dark:text-slate-400 mb-6">
              Your request has been sent to the pharmacy. They will contact you soon.
            </p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Submit Another Request
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Contact a Pharmacy</h1>
          <p className="text-gray-600 dark:text-slate-400">Get in touch with your preferred pharmacy for assistance</p>
        </div>

        <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 block">Full Name *</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your full name"
                    className="dark:bg-slate-700 dark:border-slate-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 block">Email Address *</label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter your email"
                    className="dark:bg-slate-700 dark:border-slate-600"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 block">Phone Number *</label>
                  <Input
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="Enter your phone number"
                    className="dark:bg-slate-700 dark:border-slate-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 block">Select Pharmacy *</label>
                  <Select value={formData.pharmacyId} onValueChange={(value) => setFormData({...formData, pharmacyId: value})}>
                    <SelectTrigger className="dark:bg-slate-700 dark:border-slate-600">
                      <SelectValue placeholder="Choose a pharmacy" />
                    </SelectTrigger>
                    <SelectContent>
                      {pharmacies.map((pharmacy) => (
                        <SelectItem key={pharmacy.id} value={pharmacy.id}>
                          <div className="flex items-center gap-2">
                            <Store className="h-4 w-4" />
                            {pharmacy.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 block">Address</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Enter your address"
                  className="dark:bg-slate-700 dark:border-slate-600"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 block">Request Type</label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData({...formData, type: value})}>
                    <SelectTrigger className="dark:bg-slate-700 dark:border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inquiry">General Inquiry</SelectItem>
                      <SelectItem value="prescription">Prescription Request</SelectItem>
                      <SelectItem value="order">Medicine Order</SelectItem>
                      <SelectItem value="complaint">Complaint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 block">Urgency Level</label>
                  <Select value={formData.urgency} onValueChange={(value: any) => setFormData({...formData, urgency: value})}>
                    <SelectTrigger className="dark:bg-slate-700 dark:border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 block">Message *</label>
                <Textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Describe your request or inquiry..."
                  rows={4}
                  className="dark:bg-slate-700 dark:border-slate-600"
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading || !formData.pharmacyId}
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}