/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('samaCart') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('samaCart', JSON.stringify(items))
  }, [items])

  const addItem = (product, quantity = 1) => {
    setItems(prev => {
      const exists = prev.find(i => i._id === product._id)
      if (exists) {
        return prev.map(i =>
          i._id === product._id
            ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
            : i
        )
      }
      return [...prev, { ...product, quantity }]
    })
  }

  const removeItem = (id) => setItems(prev => prev.filter(i => i._id !== id))

  const updateQty = (id, quantity) => {
    if (quantity < 1) return removeItem(id)
    setItems(prev => prev.map(i => i._id === id ? { ...i, quantity } : i))
  }

  const clearCart = () => setItems([])

  const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0)
  const count = items.reduce((acc, i) => acc + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)