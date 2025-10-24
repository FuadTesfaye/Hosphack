'use client'

import { use, useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pill, Plus, Edit, Trash2, Package, FileText, BarChart3, LogOut, Store, TrendingUp, AlertCircle, Eye, Check, X, Brain, Users } from 'lucide-react'
import Link from 'next/link'
import { MedicineDialog } from '@/components/admin/medicine-dialog'
import { getMedicines, addMedicine, updateMedicine, deleteMedicine } from '@/lib/api'
import type { Medicine, Pharmacy, LicenseRequest } from '@/lib/types'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Image from 'next/image'

// Orders Management Component
function OrdersManagement({ pharmacyId }: { pharmacyId: string }) {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [pharmacyId])

  const loadOrders = async (retryCount = 0) => {
    try {
      const response = await fetch(`/api/orders?pharmacyId=${pharmacyId}`)
      if (!response.ok) {
        if (retryCount < 2) {
          setTimeout(() => loadOrders(retryCount + 1), 1000)
          return
        }
        throw new Error('Failed to fetch')
      }
      const ordersData = await response.json()
      setOrders(Array.isArray(ordersData) ? ordersData : [])
    } catch (error) {
      console.error('Error loading orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-32">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  )

  return (
    <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl animate-fade-in-up">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-slate-700 dark:to-slate-600 border-b border-blue-200/50 dark:border-slate-600">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Orders Management ({orders.length})
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadOrders()}
              className="bg-green-50 hover:bg-green-100 border-green-300"
            >
              🔄 Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-slate-700">
              <TableRow>
                <TableHead className="font-semibold text-gray-700 dark:text-slate-300">Order ID</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-slate-300">Customer</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-slate-300">Status</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-slate-300">Total</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-slate-300">Items</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="hover:bg-blue-50/50 dark:hover:bg-slate-700/50 transition-colors border-b border-gray-100 dark:border-slate-700">
                  <TableCell className="font-mono text-sm text-gray-900 dark:text-white">{order.id.slice(0, 8)}...</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{order.customerName || 'N/A'}</p>
                      <p className="text-sm text-gray-600 dark:text-slate-400">{order.customerEmail || 'N/A'}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={order.status === 'DELIVERED' ? 'default' : 'secondary'}
                           className={order.status === 'DELIVERED' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700'}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-gray-900 dark:text-white">${order.total.toFixed(2)}</TableCell>
                  <TableCell className="text-gray-900 dark:text-white">{order.items?.length || 0} items</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {orders.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No orders found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function PharmacyDashboard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null)
  const [loading, setLoading] = useState(true)
  const [licenseRequests, setLicenseRequests] = useState<LicenseRequest[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    console.log(`🔍 Checking authentication for pharmacy dashboard: ${id}`)
    
    const pharmacyData = localStorage.getItem('pharmacy')
    console.log('📋 Stored pharmacy data:', pharmacyData ? 'Found' : 'Not found')
    
    if (pharmacyData) {
      try {
        const parsedPharmacy = JSON.parse(pharmacyData)
        console.log(`🏥 Parsed pharmacy:`, parsedPharmacy.name, `ID: ${parsedPharmacy.id}`)
        
        if (parsedPharmacy.id === id) {
          console.log(`✅ Authentication successful for: ${parsedPharmacy.name}`)
          setPharmacy(parsedPharmacy)
          loadMedicines(id)
          loadLicenseRequests(id)
        } else {
          console.log(`❌ ID mismatch: expected ${id}, got ${parsedPharmacy.id}`)
          router.push('/pharmacy-login')
        }
      } catch (error) {
        console.error('❌ Error parsing pharmacy data:', error)
        localStorage.removeItem('pharmacy')
        router.push('/pharmacy-login')
      }
    } else {
      console.log('❌ No pharmacy data found, redirecting to login')
      router.push('/pharmacy-login')
    }
  }, [id, router])

  const loadMedicines = async (pharmacyId: string) => {
    try {
      const allMedicines = await getMedicines()
      const pharmacyMedicines = allMedicines.filter(m => m.pharmacyId === pharmacyId)
      setMedicines(pharmacyMedicines)
    } catch (error) {
      console.error('Error loading medicines:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadLicenseRequests = async (pharmacyId: string) => {
    try {
      const response = await fetch(`/api/license-requests?pharmacyId=${pharmacyId}`)
      if (!response.ok) throw new Error('Failed to fetch')
      const requests = await response.json()
      const filteredRequests = requests.filter((r: any) => r.pharmacyId === pharmacyId)
      setLicenseRequests(filteredRequests)
    } catch (error) {
      console.error('Error loading license requests:', error)
    }
  }

  const handleSave = async (medicineData: Omit<Medicine, 'id'>, medicineId?: string, imageFile?: File) => {
    try {
      const dataWithPharmacy = { ...medicineData, pharmacyId: id }
      if (medicineId) {
        await updateMedicine(medicineId, dataWithPharmacy, imageFile)
      } else {
        await addMedicine(dataWithPharmacy, imageFile)
      }
      await loadMedicines(id)
      setIsDialogOpen(false)
      setSelectedMedicine(null)
    } catch (error) {
      console.error('Error saving medicine:', error)
    }
  }

  const handleDelete = async (medicineId: string) => {
    if (confirm('Are you sure you want to delete this medicine?')) {
      try {
        await deleteMedicine(medicineId)
        await loadMedicines(id)
      } catch (error) {
        console.error('Error deleting medicine:', error)
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('pharmacy')
    router.push('/pharmacy-login')
  }

  const hasPermission = (page: string) => {
    if (!pharmacy?.permissions) return false
    return pharmacy.permissions.split(',').includes(page)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!pharmacy) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this dashboard.</p>
        </div>
      </div>
    )
  }

  const allowedTabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3, permission: 'dashboard', color: 'from-blue-500 to-cyan-500' },
    { id: 'medicines', name: 'Medicines', icon: Pill, permission: 'medicines', color: 'from-green-500 to-emerald-500' },
    { id: 'orders', name: 'Orders', icon: Package, permission: 'orders', color: 'from-purple-500 to-pink-500' },
    { id: 'prescriptions', name: 'Prescriptions', icon: FileText, permission: 'prescriptions', color: 'from-orange-500 to-red-500' },
    { id: 'licenses', name: 'License Requests', icon: FileText, permission: 'medicines', color: 'from-indigo-500 to-purple-500' },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp, permission: 'dashboard', color: 'from-teal-500 to-green-500' },
    { id: 'ai-insights', name: 'AI Insights', icon: Brain, permission: 'dashboard', color: 'from-purple-500 to-indigo-500' },
    { id: 'customer-care', name: 'Customer Care', icon: Users, permission: 'dashboard', color: 'from-blue-500 to-purple-500' }
  ].filter(tab => hasPermission(tab.permission))

  const totalValue = medicines.reduce((sum, m) => sum + (m.price * m.stock), 0)
  const lowStockCount = medicines.filter(m => m.stock < 10).length
  const pendingRequests = licenseRequests.filter(r => r.status === 'pending').length

  return (
    <div className="w-full max-w-none space-y-8 animate-fade-in-up">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 p-8 lg:p-12 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-green-600/20 animate-gradient"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-6 mb-6">
            <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg hover:scale-110 transition-transform duration-300">
              <Store className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-green-100 bg-clip-text text-transparent mb-2">
                {pharmacy.name}
              </h1>
              <p className="text-blue-100 dark:text-slate-300 text-xl opacity-90">Advanced Pharmacy Management Dashboard</p>
            </div>
          </div>
          {pendingRequests > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-300/30 backdrop-blur-sm">
              <AlertCircle className="h-5 w-5" />
              <span className="text-lg font-medium">{pendingRequests} Pending License Requests</span>
            </div>
          )}
        </div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16 animate-float-delayed"></div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2">
          {allowedTabs.map((tab, index) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            // For new pages, use Link instead of onClick
            if (tab.id === 'medicines' || tab.id === 'ai-insights' || tab.id === 'customer-care' || tab.id === 'analytics') {
              return (
                <Link key={tab.id} href={`/pharmacy-dashboard/${id}/${tab.id}`}>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 transition-all duration-300 animate-fade-in-up bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:bg-blue-50 dark:hover:bg-slate-700 border-blue-200 dark:border-slate-600 hover:scale-105"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.name}
                  </Button>
                </Link>
              )
            }
            
            return (
              <Button
                key={tab.id}
                variant={isActive ? 'default' : 'outline'}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 transition-all duration-300 animate-fade-in-up ${
                  isActive 
                    ? `bg-gradient-to-r ${tab.color} text-white border-0 shadow-lg` 
                    : 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:bg-blue-50 dark:hover:bg-slate-700 border-blue-200 dark:border-slate-600'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Icon className="h-4 w-4" />
                {tab.name}
              </Button>
            )
          })}
        </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && hasPermission('dashboard') && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover-lift">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-2">Total Medicines</p>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{medicines.length}</p>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Active inventory
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg hover:scale-110 transition-transform duration-300">
                    <Pill className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover-lift">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-2">Low Stock Items</p>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{lowStockCount}</p>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Needs attention
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg hover:scale-110 transition-transform duration-300">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover-lift">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-2">Total Value</p>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">${totalValue.toLocaleString()}</p>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Inventory worth
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover-lift">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-2">License Requests</p>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{pendingRequests}</p>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400 flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      Pending approval
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg hover:scale-110 transition-transform duration-300">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>
      )}

      {/* Medicines Tab */}
      {activeTab === 'medicines' && hasPermission('medicines') && (
          <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl animate-fade-in-up">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-slate-700 dark:to-slate-600 border-b border-blue-200/50 dark:border-slate-600">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Pill className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Your Medicines ({medicines.length})
                </CardTitle>
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white border-0 hover:scale-105 transition-all duration-300"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Medicine
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50 dark:bg-slate-700">
                    <TableRow>
                      <TableHead className="font-semibold text-gray-700 dark:text-slate-300">Name</TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-slate-300">Category</TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-slate-300">Price</TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-slate-300">Stock</TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-slate-300">Expiry</TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medicines.map((medicine) => (
                      <TableRow key={medicine.id} className="hover:bg-blue-50/50 dark:hover:bg-slate-700/50 transition-colors border-b border-gray-100 dark:border-slate-700">
                        <TableCell className="font-medium text-gray-900 dark:text-white">{medicine.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700">
                            {medicine.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-gray-900 dark:text-white">${medicine.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={medicine.stock < 10 ? "destructive" : "default"}
                            className={medicine.stock < 10 ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700' : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700'}
                          >
                            {medicine.stock} units
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-900 dark:text-white">{medicine.expirationDate}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedMedicine(medicine)
                                setIsDialogOpen(true)
                              }}
                              className="hover:bg-blue-50 dark:hover:bg-blue-900/30 border-blue-200 dark:border-blue-700"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(medicine.id)}
                              className="hover:bg-red-600 dark:hover:bg-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && hasPermission('orders') && (
        <OrdersManagement pharmacyId={id} />
      )}

      <MedicineDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
        medicine={selectedMedicine}
        pharmacies={[pharmacy]}
      />
    </div>
  )
}