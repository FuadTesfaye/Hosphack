'use client'

import { useState, useEffect } from 'react';
import { getOrders, getPrescriptions } from '@/lib/data';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, ShoppingBag, UserCircle, TrendingUp, Activity, BarChart3, Users } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function DashboardPage() {
  const orders = getOrders();
  const prescriptions = getPrescriptions();
  const [realtimeData, setRealtimeData] = useState([]);
  const [currentStats, setCurrentStats] = useState({
    revenue: 45231,
    orders: 23,
    users: 1234,
    conversion: 3.2
  });

  useEffect(() => {
    const generateRealtimeData = () => {
      const now = new Date();
      const data = [];
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60000);
        data.push({
          time: time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
          orders: Math.floor(Math.random() * 10) + 15,
          revenue: Math.floor(Math.random() * 2000) + 3000,
          users: Math.floor(Math.random() * 50) + 100
        });
      }
      setRealtimeData(data);
    };

    generateRealtimeData();
    const interval = setInterval(() => {
      setRealtimeData(prev => {
        const newData = [...prev.slice(1)];
        const now = new Date();
        newData.push({
          time: now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
          orders: Math.floor(Math.random() * 10) + 15,
          revenue: Math.floor(Math.random() * 2000) + 3000,
          users: Math.floor(Math.random() * 50) + 100
        });
        return newData;
      });
      
      setCurrentStats(prev => ({
        revenue: prev.revenue + Math.floor(Math.random() * 100) - 50,
        orders: prev.orders + Math.floor(Math.random() * 3) - 1,
        users: prev.users + Math.floor(Math.random() * 10) - 5,
        conversion: Math.max(0, prev.conversion + (Math.random() * 0.2) - 0.1)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  
  const dashboardStats = [
    { label: 'Total Revenue', value: `$${currentStats.revenue.toLocaleString()}`, icon: <TrendingUp className="h-5 w-5" />, change: '+20.1%', color: 'from-green-500 to-emerald-500' },
    { label: 'Orders Today', value: currentStats.orders.toString(), icon: <ShoppingBag className="h-5 w-5" />, change: '+12%', color: 'from-blue-500 to-cyan-500' },
    { label: 'Active Users', value: currentStats.users.toLocaleString(), icon: <Users className="h-5 w-5" />, change: '+5.4%', color: 'from-purple-500 to-pink-500' },
    { label: 'Conversion Rate', value: `${currentStats.conversion.toFixed(1)}%`, icon: <BarChart3 className="h-5 w-5" />, change: '+0.8%', color: 'from-orange-500 to-red-500' },
  ];
  
  return (
    <div className="min-h-screen w-full p-6 space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-green-600 to-teal-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-blue-100 text-lg">Real-time insights and performance metrics</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-4">
        {dashboardStats.map((stat, index) => (
          <Card key={stat.label} className="relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm font-medium text-green-600">{stat.change} from last month</p>
                </div>
                <div className={`p-3 rounded-full bg-gradient-to-br ${stat.color} text-white`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Real-time Chart */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Real-time Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={realtimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="orders" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="users" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Main Content Tabs */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg flex-1">
        <Tabs defaultValue="orders" className="w-full">
          <CardHeader>
            <TabsList className="grid w-full grid-cols-3 max-w-lg bg-gray-100/80">
              <TabsTrigger value="orders" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-green-500 data-[state=active]:text-white">
                <ShoppingBag className="w-4 h-4" />Order History
              </TabsTrigger>
              <TabsTrigger value="prescriptions" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-green-500 data-[state=active]:text-white">
                <FileText className="w-4 h-4" />Prescriptions
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-green-500 data-[state=active]:text-white">
                <UserCircle className="w-4 h-4" />Account
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <TabsContent value="orders">
            <CardContent>
              <div className="mb-4">
                <CardTitle className="text-xl font-bold text-gray-900 mb-2">Recent Orders</CardTitle>
                <CardDescription>Track and monitor all customer orders</CardDescription>
              </div>
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold">Order ID</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="text-right font-semibold">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-blue-50/50 transition-colors">
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'} 
                                 className={order.status === 'Delivered' ? 'bg-green-500 hover:bg-green-600' : ''}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">${order.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="prescriptions">
            <CardContent>
              <div className="mb-4">
                <CardTitle className="text-xl font-bold text-gray-900 mb-2">Prescription Management</CardTitle>
                <CardDescription>Review and manage uploaded prescriptions</CardDescription>
              </div>
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold">Prescription ID</TableHead>
                      <TableHead className="font-semibold">Date Uploaded</TableHead>
                      <TableHead className="font-semibold">File Name</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prescriptions.map((prescription) => (
                      <TableRow key={prescription.id} className="hover:bg-blue-50/50 transition-colors">
                        <TableCell className="font-medium">{prescription.id}</TableCell>
                        <TableCell>{prescription.date}</TableCell>
                        <TableCell>{prescription.fileName}</TableCell>
                        <TableCell>
                          <Badge variant={
                            prescription.status === 'Approved' ? 'default' :
                            prescription.status === 'Rejected' ? 'destructive' : 'secondary'
                          } className={
                            prescription.status === 'Approved' ? 'bg-green-500 hover:bg-green-600' :
                            prescription.status === 'Rejected' ? 'bg-red-500 hover:bg-red-600' : ''
                          }>
                            {prescription.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="account">
            <CardContent>
              <div className="mb-6">
                <CardTitle className="text-xl font-bold text-gray-900 mb-2">Account Settings</CardTitle>
                <CardDescription>Update your personal information and preferences</CardDescription>
              </div>
              <div className="space-y-6 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                  <Input id="name" defaultValue="John Doe" className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                  <Input id="email" type="email" defaultValue="john.doe@example.com" className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">New Password</Label>
                  <Input id="password" type="password" placeholder="Enter new password" className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <Button className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white border-0">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}