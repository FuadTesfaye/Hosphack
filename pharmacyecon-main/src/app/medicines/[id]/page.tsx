'use client'

import { use, useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Pill, Store, DollarSign, Package, Shield, Upload } from 'lucide-react'
import { getMedicines, getPharmacies } from '@/lib/api'
import type { Medicine, Pharmacy } from '@/lib/types'
import Link from 'next/link'

export default function MedicineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [medicine, setMedicine] = useState<Medicine | null>(null)
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [showLicenseDialog, setShowLicenseDialog] = useState(false)
  const [licenseFile, setLicenseFile] = useState<File | null>(null)
  const [submittingLicense, setSubmittingLicense] = useState(false)

  useEffect(() => {
    loadMedicine()
  }, [id])

  const loadMedicine = async () => {
    try {
      const [medicines, pharmacies] = await Promise.all([
        getMedicines(),
        getPharmacies()
      ])
      
      const foundMedicine = medicines.find(m => m.id === id)
      if (foundMedicine) {
        setMedicine(foundMedicine)
        const foundPharmacy = pharmacies.find(p => p.id === foundMedicine.pharmacyId)
        setPharmacy(foundPharmacy || null)
      }
    } catch (error) {
      console.error('Error loading medicine:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!medicine) return

    if (medicine.requiresLicense) {
      setShowLicenseDialog(true)
    } else {
      addToCart()
    }
  }

  const addToCart = () => {
    if (!medicine || !pharmacy) return

    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cartItems.find((item: any) => item.id === medicine.id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cartItems.push({
        id: medicine.id,
        name: medicine.name,
        price: medicine.price,
        quantity: quantity,
        pharmacyId: medicine.pharmacyId,
        pharmacyName: pharmacy.name
      })
    }

    localStorage.setItem('cart', JSON.stringify(cartItems))
    alert('Medicine added to cart!')
  }

  const handleLicenseSubmit = async () => {
    if (!licenseFile || !medicine) return

    setSubmittingLicense(true)

    try {
      const licenseRequest = {
        id: Date.now().toString(),
        medicineId: medicine.id,
        medicineName: medicine.name,
        userId: 'user-' + Date.now(),
        userName: 'Customer',
        userEmail: 'customer@example.com',
        licenseFile: licenseFile.name,
        quantity: quantity,
        status: 'pending',
        timestamp: new Date().toISOString()
      }

      const existingRequests = JSON.parse(localStorage.getItem('license-requests') || '[]')
      existingRequests.push(licenseRequest)
      localStorage.setItem('license-requests', JSON.stringify(existingRequests))

      setShowLicenseDialog(false)
      alert('License submitted for approval. You will be notified once approved.')
    } catch (error) {
      console.error('Error submitting license:', error)
    } finally {
      setSubmittingLicense(false)
    }
  }

  const handleDirectOrder = () => {
    if (!medicine || !pharmacy) return

    if (medicine.requiresLicense) {
      alert('This medicine requires a license. Please submit your license first.')
      return
    }

    const order = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      customerName: 'Customer',
      customerEmail: 'customer@example.com',
      customerPhone: '+1234567890',
      customerAddress: '123 Main St, City, State',
      items: [{
        id: medicine.id,
        name: medicine.name,
        price: medicine.price,
        quantity: quantity
      }],
      total: medicine.price * quantity,
      status: 'pending',
      timestamp: new Date().toISOString(),
      pharmacyId: medicine.pharmacyId,
      pharmacyName: pharmacy.name
    }

    const existingOrders = JSON.parse(localStorage.getItem(`pharmacy-orders-${medicine.pharmacyId}`) || '[]')
    existingOrders.push(order)
    localStorage.setItem(`pharmacy-orders-${medicine.pharmacyId}`, JSON.stringify(existingOrders))

    alert(`Order placed successfully! ${pharmacy.name} will contact you soon.`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!medicine) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Pill className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Medicine Not Found</h2>
          <Link href="/medicines">
            <Button>Back to Medicines</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/medicines">
          <Button variant="outline" className="mb-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Medicines
          </Button>
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Medicine Details */}
          <div className="lg:col-span-2">
            <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {medicine.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                      <Store className="h-4 w-4" />
                      {pharmacy?.name || 'Unknown Pharmacy'}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30">
                      {medicine.category}
                    </Badge>
                    {medicine.requiresLicense && (
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        <Shield className="h-3 w-3 mr-1" />
                        License Required
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {medicine.imageUrl && (
                  <div className="w-full h-64 bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                    <img 
                      src={medicine.imageUrl} 
                      alt={medicine.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                  <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                    {medicine.description}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-gray-900 dark:text-white">Price</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">${medicine.price}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-900 dark:text-white">Stock</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{medicine.stock} available</p>
                  </div>
                </div>

                {pharmacy && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Pharmacy Information</h4>
                    <p className="text-gray-600 dark:text-slate-400">{pharmacy.name}</p>
                    <p className="text-sm text-gray-500 dark:text-slate-500">{pharmacy.address}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Add to Cart Sidebar */}
          <div>
            <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl sticky top-8">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Add to Cart</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 block">
                    Quantity
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max={medicine.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="dark:bg-slate-700 dark:border-slate-600"
                  />
                </div>

                <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900 dark:text-white">Total:</span>
                    <span className="text-xl font-bold text-green-600">
                      ${(medicine.price * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>

                {medicine.requiresLicense && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm font-medium">License verification required</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Button 
                    onClick={handleAddToCart}
                    disabled={medicine.stock === 0}
                    className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                  >
                    {medicine.requiresLicense ? 'Submit License & Add to Cart' : 'Add to Cart'}
                  </Button>
                  
                  <Button 
                    onClick={handleDirectOrder}
                    disabled={medicine.stock === 0 || (medicine.requiresLicense && !medicine.licenseApproved)}
                    variant="outline"
                    className="w-full border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    Order Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* License Upload Dialog */}
        {showLicenseDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">License Required</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-slate-400">
                  This medicine requires a valid license. Please upload your license for verification.
                </p>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 block">
                    Upload License
                  </label>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setLicenseFile(e.target.files?.[0] || null)}
                    className="dark:bg-slate-700 dark:border-slate-600"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleLicenseSubmit}
                    disabled={!licenseFile || submittingLicense}
                    className="flex-1"
                  >
                    {submittingLicense ? 'Submitting...' : 'Submit License'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowLicenseDialog(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}