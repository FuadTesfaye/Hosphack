'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Shield, CheckCircle, XCircle, Clock, Eye } from 'lucide-react'

interface LicenseRequest {
  id: string
  medicineId: string
  medicineName: string
  userId: string
  userName: string
  userEmail: string
  licenseFile: string
  quantity: number
  status: 'pending' | 'approved' | 'rejected'
  timestamp: string
}

export default function LicenseRequestsPage() {
  const [requests, setRequests] = useState<LicenseRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<LicenseRequest | null>(null)

  useEffect(() => {
    loadRequests()
    const interval = setInterval(loadRequests, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadRequests = () => {
    const savedRequests = JSON.parse(localStorage.getItem('license-requests') || '[]')
    setRequests(savedRequests.sort((a: LicenseRequest, b: LicenseRequest) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ))
  }

  const updateRequestStatus = (requestId: string, status: 'approved' | 'rejected') => {
    const updatedRequests = requests.map(req => {
      if (req.id === requestId) {
        const updatedReq = { ...req, status }
        
        // If approved, add to cart
        if (status === 'approved') {
          addToUserCart(updatedReq)
        }
        
        return updatedReq
      }
      return req
    })
    
    setRequests(updatedRequests)
    localStorage.setItem('license-requests', JSON.stringify(updatedRequests))
    setSelectedRequest(null)
  }

  const addToUserCart = (request: LicenseRequest) => {
    // Simulate adding to user's cart
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cartItems.find((item: any) => item.id === request.medicineId)

    if (existingItem) {
      existingItem.quantity += request.quantity
    } else {
      cartItems.push({
        id: request.medicineId,
        name: request.medicineName,
        quantity: request.quantity,
        licenseApproved: true
      })
    }

    localStorage.setItem('cart', JSON.stringify(cartItems))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 p-8 lg:p-12 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-6 mb-6">
            <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-orange-100 to-pink-100 bg-clip-text text-transparent mb-2">
                License Requests
              </h1>
              <p className="text-orange-100 dark:text-slate-300 text-xl opacity-90">Review and approve medicine license requests</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Total Requests</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Approved</p>
                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests Table */}
      <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Shield className="h-5 w-5 text-orange-600" />
            License Requests ({requests.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-slate-700/50">
                  <TableHead>Customer</TableHead>
                  <TableHead>Medicine</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30">
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{request.userName}</p>
                        <p className="text-sm text-gray-600 dark:text-slate-400">{request.userEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-gray-900 dark:text-white">{request.medicineName}</p>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-900 dark:text-white">{request.quantity}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
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
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateRequestStatus(request.id, 'approved')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => updateRequestStatus(request.id, 'rejected')}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
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
          <Card className="w-full max-w-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-gray-900 dark:text-white">License Request Details</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setSelectedRequest(null)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-slate-400">Customer</label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedRequest.userName}</p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">{selectedRequest.userEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-slate-400">Medicine</label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedRequest.medicineName}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-slate-400">Quantity</label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedRequest.quantity}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-slate-400">Status</label>
                  <Badge className={getStatusColor(selectedRequest.status)}>
                    {selectedRequest.status}
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
                <label className="text-sm font-medium text-gray-600 dark:text-slate-400">License File</label>
                <div className="mt-2 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <p className="text-gray-900 dark:text-white">{selectedRequest.licenseFile}</p>
                  <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">
                    License document uploaded by customer
                  </p>
                </div>
              </div>

              {selectedRequest.status === 'pending' && (
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => updateRequestStatus(selectedRequest.id, 'approved')}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve & Add to Cart
                  </Button>
                  <Button
                    onClick={() => updateRequestStatus(selectedRequest.id, 'rejected')}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Request
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}