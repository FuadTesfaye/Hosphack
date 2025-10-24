'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Pill, Search, Store, DollarSign, Package } from 'lucide-react'
import { getMedicines, getPharmacies } from '@/lib/api'
import type { Medicine, Pharmacy } from '@/lib/types'
import Link from 'next/link'

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [medicinesData, pharmaciesData] = await Promise.all([
        getMedicines(),
        getPharmacies()
      ])
      setMedicines(medicinesData)
      setPharmacies(pharmaciesData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPharmacyName = (pharmacyId: string) => {
    const pharmacy = pharmacies.find(p => p.id === pharmacyId)
    return pharmacy?.name || 'Unknown Pharmacy'
  }

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || medicine.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(medicines.map(m => m.category))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Pill className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Browse Medicines</h1>
          <p className="text-gray-600 dark:text-slate-400">Find the medicines you need from our partner pharmacies</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm"
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Contact Pharmacy CTA */}
        <Card className="mb-8 border-0 bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-xl">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Need Help Finding a Medicine?</h2>
            <p className="mb-4 opacity-90">Contact any of our partner pharmacies directly for personalized assistance</p>
            <Link href="/customer-register">
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                Contact a Pharmacy
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Medicines Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMedicines.map((medicine) => (
            <Card key={medicine.id} className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {medicine.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                      <Store className="h-4 w-4" />
                      {getPharmacyName(medicine.pharmacyId)}
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    {medicine.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {medicine.imageUrl && (
                  <div className="w-full h-32 bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                    <img 
                      src={medicine.imageUrl} 
                      alt={medicine.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-2">
                  {medicine.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-xl font-bold text-green-600">${medicine.price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-slate-400">
                      {medicine.stock} in stock
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/medicines/${medicine.id}`} className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMedicines.length === 0 && (
          <div className="text-center py-12">
            <Pill className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No medicines found</h3>
            <p className="text-gray-600 dark:text-slate-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}