'use client';

import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus, deleteOrder } from '@/lib/api';
import type { Order } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, ShoppingCart, Package, Truck, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { OrderDetailsDialog } from '@/components/admin/order-details-dialog';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    
    // Listen for order updates
    const handleOrdersUpdated = () => {
      console.log('🔄 Orders updated event received, refreshing...');
      setTimeout(() => loadData(), 1000);
    };
    
    window.addEventListener('ordersUpdated', handleOrdersUpdated);
    
    return () => {
      window.removeEventListener('ordersUpdated', handleOrdersUpdated);
    };
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const ordersData = await response.json();
        setOrders(ordersData);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        const response = await fetch(`/api/orders?id=${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          await loadData();
        }
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  }

  const orderStatuses = ['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  const totalOrders = orders.length;
  const processingOrders = orders.filter(o => o.status === 'PROCESSING').length;
  const deliveredOrders = orders.filter(o => o.status === 'DELIVERED').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PROCESSING': return <Clock className="h-4 w-4" />;
      case 'SHIPPED': return <Truck className="h-4 w-4" />;
      case 'DELIVERED': return <CheckCircle className="h-4 w-4" />;
      case 'CANCELLED': return <XCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="w-full max-w-none space-y-8 animate-fade-in-up">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 p-8 lg:p-12 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-green-600/20 animate-gradient"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-6 mb-6">
            <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg hover:scale-110 transition-transform duration-300">
              <ShoppingCart className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-green-100 bg-clip-text text-transparent mb-2">
                Order Management
              </h1>
              <p className="text-blue-100 dark:text-slate-300 text-xl opacity-90">Track and manage all customer orders with real-time updates</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16 animate-float-delayed"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 w-full">
        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover-lift">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-2">Total Orders</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{totalOrders}</p>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  All time
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg hover:scale-110 transition-transform duration-300">
                <ShoppingCart className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover-lift">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-2">Processing</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{processingOrders}</p>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Pending orders
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg hover:scale-110 transition-transform duration-300">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover-lift">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-2">Delivered</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{deliveredOrders}</p>
                <p className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Completed orders
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg hover:scale-110 transition-transform duration-300">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover-lift">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-2">Total Revenue</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">${totalRevenue.toLocaleString()}</p>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400 flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  From orders
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg hover:scale-110 transition-transform duration-300">
                <Package className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-2xl w-full">
        <CardContent className="p-0">
          <div className="p-8 border-b border-gray-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Orders</h2>
                  <p className="text-gray-600 dark:text-slate-400">Monitor and manage customer orders with real-time tracking</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/orders?debug=all');
                      const data = await response.json();
                      console.log('🔍 Debug orders:', data);
                      alert(`Found ${data.totalOrders} total orders. Check console for details.`);
                    } catch (error) {
                      console.error('Debug failed:', error);
                    }
                  }}
                  className="bg-blue-50 hover:bg-blue-100 border-blue-300"
                >
                  🔍 Debug Orders
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadData()}
                  className="bg-green-50 hover:bg-green-100 border-green-300"
                >
                  🔄 Refresh
                </Button>
              </div>
            </div>
          </div>
          <div className="overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold">Order ID</TableHead>
                  <TableHead className="font-semibold">Customer</TableHead>
                  <TableHead className="font-semibold">Pharmacy</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">Total</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-blue-50/50 transition-colors">
                    <TableCell className="font-medium">{order.id.slice(0, 8)}...</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-gray-600">{order.customerEmail}</p>
                        {order.customerLocation && (
                          <p className="text-xs text-green-600">📍 {order.customerLocation}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-blue-600">{order.pharmacyName}</p>
                    </TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === 'DELIVERED'
                            ? 'default'
                            : order.status === 'CANCELLED'
                            ? 'destructive'
                            : 'secondary'
                        }
                        className={`flex items-center gap-1 w-fit ${
                          order.status === 'DELIVERED' ? 'bg-green-100 text-green-800 border-green-200' :
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-800 border-red-200' :
                          order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          'bg-orange-100 text-orange-800 border-orange-200'
                        }`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost" className="hover:bg-blue-100">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewDetails(order)} className="hover:bg-blue-50">
                            View Details
                          </DropdownMenuItem>
                           <DropdownMenuSub>
                              <DropdownMenuSubTrigger className="hover:bg-blue-50">Update Status</DropdownMenuSubTrigger>
                              <DropdownMenuPortal>
                                  <DropdownMenuSubContent className="bg-white/95 backdrop-blur-sm">
                                      {orderStatuses.map(status => (
                                          <DropdownMenuItem key={status} onClick={() => handleUpdateStatus(order.id, status)} className="hover:bg-blue-50">
                                              <div className="flex items-center gap-2">
                                                {getStatusIcon(status)}
                                                {status}
                                              </div>
                                          </DropdownMenuItem>
                                      ))}
                                  </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive hover:bg-red-50"
                            onClick={() => handleDeleteOrder(order.id)}
                          >
                            Delete Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedOrder && (
        <OrderDetailsDialog 
            isOpen={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
            order={selectedOrder}
        />
      )}
    </div>
  );
}