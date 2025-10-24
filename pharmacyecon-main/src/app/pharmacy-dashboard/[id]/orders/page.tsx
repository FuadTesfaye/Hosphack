'use client'

import { use, useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ShoppingCart, Package, Clock, CheckCircle, XCircle, Eye, Phone, Mail, MapPin } from 'lucide-react'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface PharmacyOrder {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  timestamp: string
  pharmacyId: string
  pharmacyName: string
}

export default function PharmacyOrdersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [orders, setOrders] = useState<PharmacyOrder[]>([])
  const [selectedOrder, setSelectedOrder] = useState<PharmacyOrder | null>(null)
  const [pharmacy, setPharmacy] = useState<any>(null)

  useEffect(() => {
    const pharmacyData = localStorage.getItem('pharmacy')
    if (pharmacyData) {
      setPharmacy(JSON.parse(pharmacyData))
    }

    loadOrders()
    const interval = setInterval(loadOrders, 5000)
    return () => clearInterval(interval)
  }, [id])

  const loadOrders = () => {
    console.log(`Loading orders for pharmacy ID: ${id}`)
    
    // Check all pharmacy order keys in localStorage
    const allKeys = Object.keys(localStorage).filter(key => key.startsWith('pharmacy-orders-'))
    console.log('All pharmacy order keys in localStorage:', allKeys)
    
    const savedOrders = JSON.parse(localStorage.getItem(`pharmacy-orders-${id}`) || '[]')
    console.log(`Orders found for pharmacy ${id}:`, savedOrders)
    
    // Also check default-pharmacy orders
    const defaultOrders = JSON.parse(localStorage.getItem('pharmacy-orders-default-pharmacy') || '[]')
    console.log('Default pharmacy orders:', defaultOrders)
    
    // Combine orders from both sources
    const allOrders = [...savedOrders, ...defaultOrders]
    
    setOrders(allOrders.sort((a: PharmacyOrder, b: PharmacyOrder) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ))
  }

  const updateOrderStatus = (orderId: string, status: PharmacyOrder['status']) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    )
    setOrders(updatedOrders)
    localStorage.setItem(`pharmacy-orders-${id}`, JSON.stringify(updatedOrders))
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'processing': return <Package className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
    revenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.total || 0), 0)
  }

  return (
    <div className="w-full max-w-none space-y-8 animate-fade-in-up">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 p-8 lg:p-12 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 via-blue-600/20 to-purple-600/20 animate-gradient"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-6 mb-6">
            <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg hover:scale-110 transition-transform duration-300">
              <ShoppingCart className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-green-100 to-blue-100 bg-clip-text text-transparent mb-2">
                Orders
              </h1>
              <p className="text-green-100 dark:text-slate-300 text-xl opacity-90">Manage customer orders for {pharmacy?.name}</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16 animate-float-delayed"></div>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
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

        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Processing</p>
                <p className="text-3xl font-bold text-blue-600">{stats.processing}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Revenue</p>
                <p className="text-3xl font-bold text-purple-600">${stats.revenue.toFixed(2)}</p>
              </div>
              <Package className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <ShoppingCart className="h-5 w-5 text-green-600" />
            Customer Orders ({orders.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-slate-700/50">
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order, index) => (
                  <TableRow key={`${order.id}-${index}-${order.timestamp}`} className="hover:bg-gray-50 dark:hover:bg-slate-700/30">
                    <TableCell>
                      <span className="font-mono text-sm">{order.id.slice(0, 8)}...</span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{order.customerName}</p>
                        <p className="text-sm text-gray-600 dark:text-slate-400">{order.customerEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-900 dark:text-white">{order.items.length} items</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-green-600">${(order.total || 0).toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(order.timestamp).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {order.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'processing')}
                          >
                            Accept
                          </Button>
                        )}
                        {order.status === 'processing' && (
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Complete
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

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl overflow-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-gray-900 dark:text-white">Order Details</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setSelectedOrder(null)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-slate-400">Order ID</label>
                  <p className="font-mono text-sm text-gray-900 dark:text-white">{selectedOrder.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-slate-400">Status</label>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(selectedOrder.status)}
                      {selectedOrder.status}
                    </div>
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-slate-400">Customer Information</label>
                <div className="mt-2 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg space-y-2">
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedOrder.customerName}</p>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                    <Mail className="h-4 w-4" />
                    <span>{selectedOrder.customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                    <Phone className="h-4 w-4" />
                    <span>{selectedOrder.customerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedOrder.customerAddress}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-slate-400">Order Items</label>
                <div className="mt-2 space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={`${item.id}-${index}-${selectedOrder.id}`} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                        <p className="text-sm text-gray-600 dark:text-slate-400">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">${(item.price || 0).toFixed(2)}</p>
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                          Total: ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Amount:</span>
                  <span className="text-2xl font-bold text-green-600">${(selectedOrder.total || 0).toFixed(2)}</span>
                </div>
              </div>

              {selectedOrder.status !== 'completed' && selectedOrder.status !== 'cancelled' && (
                <div className="flex gap-2 pt-4">
                  {selectedOrder.status === 'pending' && (
                    <Button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                      className="flex-1"
                    >
                      Accept Order
                    </Button>
                  )}
                  {selectedOrder.status === 'processing' && (
                    <Button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'completed')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Mark as Completed
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                    className="flex-1 text-red-600 hover:text-red-700"
                  >
                    Cancel Order
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        Live Orders
      </div>
    </div>
  )
}