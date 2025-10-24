'use client'

import { use, useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Users, MessageSquare, Phone, Mail, MapPin, Clock, AlertCircle, CheckCircle, Eye } from 'lucide-react'

interface CustomerRequest {
  id: string
  name: string
  email: string
  phone: string
  address: string
  message: string
  pharmacyId: string
  urgency: 'low' | 'medium' | 'high'
  type: 'inquiry' | 'complaint' | 'prescription' | 'order'
  timestamp: string
  status: 'pending' | 'in-progress' | 'resolved'
}

export default function CustomerCarePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [requests, setRequests] = useState<CustomerRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<CustomerRequest | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'resolved'>('all')

  useEffect(() => {
    loadRequests()
    const interval = setInterval(loadRequests, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [id])

  const loadRequests = () => {
    const savedRequests = JSON.parse(localStorage.getItem(`customer-requests-${id}`) || '[]')
    setRequests(savedRequests.sort((a: CustomerRequest, b: CustomerRequest) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ))
  }

  const updateRequestStatus = (requestId: string, status: CustomerRequest['status']) => {
    const updatedRequests = requests.map(req => 
      req.id === requestId ? { ...req, status } : req
    )
    setRequests(updatedRequests)
    localStorage.setItem(`customer-requests-${id}`, JSON.stringify(updatedRequests))
    if (selectedRequest?.id === requestId) {
      setSelectedRequest({ ...selectedRequest, status })
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'inquiry': return <MessageSquare className="h-4 w-4" />
      case 'complaint': return <AlertCircle className="h-4 w-4" />
      case 'prescription': return <Phone className="h-4 w-4" />
      case 'order': return <CheckCircle className="h-4 w-4" />
      default: return <MessageSquare className="h-4 w-4" />
    }
  }

  const filteredRequests = requests.filter(req => 
    filter === 'all' || req.status === filter
  )

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    inProgress: requests.filter(r => r.status === 'in-progress').length,
    resolved: requests.filter(r => r.status === 'resolved').length
  }

  return (
    <div className="w-full max-w-none space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 p-8 lg:p-12 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-600/20 animate-gradient"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-6 mb-6">
            <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg hover:scale-110 transition-transform duration-300">
              <Users className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-2">
                Customer Care
              </h1>
              <p className="text-blue-100 dark:text-slate-300 text-xl opacity-90">Manage customer requests and inquiries</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16 animate-float-delayed"></div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Total Requests</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Pending</p>
                <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                <MessageSquare className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Resolved</p>
                <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'pending', 'in-progress', 'resolved'] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            onClick={() => setFilter(status)}
            className={filter === status ? 'bg-blue-600 text-white' : ''}
          >
            {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
          </Button>
        ))}
      </div>

      {/* Requests Table */}
      <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Users className="h-5 w-5 text-blue-600" />
            Customer Requests ({filteredRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-slate-700/50">
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30">
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{request.name}</p>
                        <p className="text-sm text-gray-600 dark:text-slate-400">{request.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(request.type)}
                        <span className="capitalize">{request.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getUrgencyColor(request.urgency)}>
                        {request.urgency}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(request.timestamp).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {request.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => updateRequestStatus(request.id, 'in-progress')}
                          >
                            Start
                          </Button>
                        )}
                        {request.status === 'in-progress' && (
                          <Button
                            size="sm"
                            onClick={() => updateRequestStatus(request.id, 'resolved')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Resolve
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl overflow-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-gray-900 dark:text-white">Request Details</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setSelectedRequest(null)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-slate-400">Customer Name</label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedRequest.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-slate-400">Request Type</label>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(selectedRequest.type)}
                    <span className="capitalize text-gray-900 dark:text-white">{selectedRequest.type}</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-slate-400">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-900 dark:text-white">{selectedRequest.email}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-slate-400">Phone</label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-900 dark:text-white">{selectedRequest.phone}</span>
                  </div>
                </div>
              </div>

              {selectedRequest.address && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-slate-400">Address</label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-900 dark:text-white">{selectedRequest.address}</span>
                  </div>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-slate-400">Urgency</label>
                  <Badge className={getUrgencyColor(selectedRequest.urgency)}>
                    {selectedRequest.urgency}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-slate-400">Status</label>
                  <Badge className={getStatusColor(selectedRequest.status)}>
                    {selectedRequest.status.replace('-', ' ')}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-slate-400">Date</label>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(selectedRequest.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-slate-400">Message</label>
                <div className="mt-2 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{selectedRequest.message}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                {selectedRequest.status === 'pending' && (
                  <Button
                    onClick={() => updateRequestStatus(selectedRequest.id, 'in-progress')}
                    className="flex-1"
                  >
                    Start Working
                  </Button>
                )}
                {selectedRequest.status === 'in-progress' && (
                  <Button
                    onClick={() => updateRequestStatus(selectedRequest.id, 'resolved')}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Mark as Resolved
                  </Button>
                )}
                <Button variant="outline" onClick={() => setSelectedRequest(null)} className="flex-1">
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Real-time indicator */}
      <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        Live Updates
      </div>
    </div>
  )
}