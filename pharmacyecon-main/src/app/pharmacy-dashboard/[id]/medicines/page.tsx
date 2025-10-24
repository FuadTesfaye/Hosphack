'use client'

import { use, useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pill, Plus, Edit, Trash2, ArrowLeft, TrendingUp, AlertCircle, Package } from 'lucide-react'
import { MedicineDialog } from '@/components/admin/medicine-dialog'
import { getMedicines, addMedicine, updateMedicine, deleteMedicine } from '@/lib/api'
import type { Medicine, Pharmacy } from '@/lib/types'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function PharmacyMedicinesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)

  useEffect(() => {
    const pharmacyData = localStorage.getItem('pharmacy')
    if (pharmacyData) {
      try {
        const parsedPharmacy = JSON.parse(pharmacyData)
        if (parsedPharmacy.id === id) {
          setPharmacy(parsedPharmacy)
          loadMedicines(id)
        } else {
          router.push('/pharmacy-login')
        }
      } catch (error) {
        router.push('/pharmacy-login')
      }
    } else {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!pharmacy) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-slate-400">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  const totalValue = medicines.reduce((sum, m) => sum + (m.price * m.stock), 0)
  const lowStockCount = medicines.filter(m => m.stock < 10).length

  return (
    <div className="w-full max-w-none space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/pharmacy-dashboard/${id}`}>
          <Button variant="outline" size="icon" className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:scale-105 transition-all duration-300">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Medicine Management</h1>
          <p className="text-gray-600 dark:text-slate-400">{pharmacy.name} - Inventory Control</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
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
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
                  <Pill className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
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
                <div className="p-4 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg">
                  <AlertCircle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-2">Total Value</p>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">${totalValue.toLocaleString()}</p>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    Inventory worth
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg">
                  <Package className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      {/* Medicines Table */}
      <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl">
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
            <div className="overflow-x-auto">
              <Table className="w-full">
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
              {medicines.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-slate-400">
                  <Pill className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-slate-600" />
                  <p className="text-lg font-medium">No medicines found</p>
                  <p className="text-sm">Add your first medicine to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

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