'use client'

import { useState, useEffect } from 'react'

export function useCart() {
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const count = cart.reduce((total: number, item: any) => total + item.quantity, 0)
      setCartCount(count)
    }

    updateCartCount()
    
    // Listen for storage changes
    window.addEventListener('storage', updateCartCount)
    
    // Check for updates periodically
    const interval = setInterval(updateCartCount, 1000)

    return () => {
      window.removeEventListener('storage', updateCartCount)
      clearInterval(interval)
    }
  }, [])

  return { cartCount }
}