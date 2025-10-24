'use client'

import { use, useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { getMedicines, getPharmacies } from '@/lib/api'
import { Search, ShoppingCart, Pill, Filter, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Medicine, Pharmacy } from '@/lib/types'

export default function PharmacyStorePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null)
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      const [pharmaciesData, medicinesData] = await Promise.all([
        getPharmacies(),
        getMedicines()
      ])
      
      const currentPharmacy = pharmaciesData.find(p => p.id === id)
      setPharmacy(currentPharmacy || null)
      
      const pharmacyMedicines = medicinesData.filter(m => m.pharmacyId === id)
      setMedicines(pharmacyMedicines)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', ...Array.from(new Set(medicines.map(m => m.category)))]
  
  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || medicine.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/pharmacies">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pharmacies
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {pharmacy?.name || 'Pharmacy'} - Medicines
          </h1>
          <p className="text-gray-600">Browse available medicines from this pharmacy</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <Card className="border-0 bg-white/90 backdrop-blur-xl shadow-xl sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search medicines..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="w-full justify-start"
                      >
                        {category === 'all' ? 'All Categories' : category}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:w-3/4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Available Medicines</h2>
                <Badge className="bg-blue-100 text-blue-800">
                  <Pill className="w-4 h-4 mr-1" />
                  {filteredMedicines.length} medicines
                </Badge>
              </div>
              <Link href="/cart">
                <Button className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  View Cart
                </Button>
              </Link>
            </div>

            {filteredMedicines.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMedicines.map((medicine) => (
                  <Card key={medicine.id} className="group overflow-hidden border-0 bg-white/90 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <CardHeader className="p-0 relative overflow-hidden">
                      <div className="relative h-48 w-full">
                        <Image
                          src={medicine.imageUrl}
                          alt={medicine.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          unoptimized
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                          <span className="font-bold text-green-600">${medicine.price}</span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6">
                      <CardTitle className="text-lg font-bold mb-2">
                        {medicine.name}
                      </CardTitle>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{medicine.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          {medicine.category}
                        </Badge>
                        <div className="text-sm text-gray-500">
                          Stock: {medicine.stock} available
                        </div>
                      </div>

                      <Button 
                        asChild
                        className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                      >
                        <Link href={`/medicines/${medicine.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
                <CardContent className="p-16 text-center">
                  <Pill className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold text-gray-600 mb-3">No medicines found</h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm || selectedCategory !== 'all' ? 'Try adjusting your filters' : 'This pharmacy has no medicines available yet'}
                  </p>
                  {(searchTerm || selectedCategory !== 'all') && (
                    <Button onClick={() => { setSearchTerm(''); setSelectedCategory('all') }}>
                      Clear Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}