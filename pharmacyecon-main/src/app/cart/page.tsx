'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Trash2, Plus, Minus, Store, User, Mail, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  pharmacyId?: string
  pharmacyName?: string
  licenseApproved?: boolean
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [showCheckoutForm, setShowCheckoutForm] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })

  useEffect(() => {
    loadCart()
    const interval = setInterval(loadCart, 2000)
    return () => clearInterval(interval)
  }, [])

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCartItems(savedCart)
  }

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
      return
    }

    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    )
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter(item => item.id !== id)
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('cart')
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!')
      return
    }
    setShowCheckoutForm(true)
  }

  const handleSubmitOrder = () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert('Please fill in all required fields (Name, Email, Phone)')
      return
    }

    const ordersByPharmacy = cartItems.reduce((acc, item) => {
      const pharmacyId = item.pharmacyId || 'default-pharmacy'
      if (!acc[pharmacyId]) {
        acc[pharmacyId] = []
      }
      acc[pharmacyId].push(item)
      return acc
    }, {} as Record<string, CartItem[]>)

    let ordersCreated = 0
    Object.entries(ordersByPharmacy).forEach(([pharmacyId, items]) => {
      const order = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address || 'Not provided',
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'pending',
        timestamp: new Date().toISOString(),
        pharmacyId: pharmacyId,
        pharmacyName: items[0].pharmacyName || 'Unknown Pharmacy'
      }

      const existingOrders = JSON.parse(localStorage.getItem(`pharmacy-orders-${pharmacyId}`) || '[]')
      existingOrders.push(order)
      localStorage.setItem(`pharmacy-orders-${pharmacyId}`, JSON.stringify(existingOrders))
      ordersCreated++
    })

    clearCart()
    setShowCheckoutForm(false)
    setCustomerInfo({ name: '', email: '', phone: '', address: '' })
    alert(`${ordersCreated} order(s) placed successfully! The pharmacy(ies) will contact you soon.`)
  }

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-slate-400 mb-6">Add some medicines to get started</p>
          <Link href="/medicines">
            <Button className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
              Browse Medicines
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Shopping Cart</h1>
          <p className="text-gray-600 dark:text-slate-400">Review your selected medicines</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <Card key={`${item.id}-${index}`} className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {item.name}
                      </h3>
                      {item.pharmacyName && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 mb-2">
                          <Store className="h-4 w-4" />
                          {item.pharmacyName}
                        </div>
                      )}
                      {item.licenseApproved && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 mb-2">
                          License Approved
                        </Badge>
                      )}
                      <p className="text-xl font-bold text-green-600">${item.price}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeItem(item.id)}
                          className="mt-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <Card className="border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-xl sticky top-8">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600 dark:text-slate-400">
                    <span>Items ({cartItems.length})</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-slate-400">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                >
                  Place Order
                </Button>

                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="w-full text-red-600 hover:text-red-700"
                >
                  Clear Cart
                </Button>

                <Link href="/medicines">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Customer Information Form */}
        {showCheckoutForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 block">
                    <User className="h-4 w-4 inline mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    placeholder="Enter your full name"
                    className="w-full p-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 block">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    placeholder="Enter your email"
                    className="w-full p-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 block">
                    <Phone className="h-4 w-4 inline mr-2" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    placeholder="Enter your phone number"
                    className="w-full p-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 block">
                    <MapPin className="h-4 w-4 inline mr-2" />
                    Address (Optional)
                  </label>
                  <input
                    type="text"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                    placeholder="Enter your address"
                    className="w-full p-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleSubmitOrder}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                  >
                    Submit Order
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCheckoutForm(false)}
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