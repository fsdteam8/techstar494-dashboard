"use client"

import { useState } from "react"
import AddProductForm from "./AddProductForm"
import ProductsTable from "./ProductsTable"
import ProductsHeader from "./ProductsHeader"

interface ProductPrice {
  unit: string
  quantity: number
  price: number
}

interface Product {
  _id: string
  name: string
  description: string
  benefits: string[]
  prices: ProductPrice[]
  photo: string[]
  createdAt: string
  slug: string
  batch?: string
  disclaimers?: string
  restrictedStates?: string[]
  category?: string
  experiences?: string | string[]
  dosage?: string
  expirationDate?: string
}

export default function ProductManager() {
  const [showAddProductForm, setShowAddProductForm] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")

  const handleAddProductClick = () => {
    setShowAddProductForm(true)
    setEditProduct(null)
  }

  const handleSaveProduct = () => {
    console.log("Product saved!")
    setShowAddProductForm(false)
    setEditProduct(null)
  }

  const handleEditProduct = (product: Product) => {
    setEditProduct(product)
    setShowAddProductForm(true)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <>
      {showAddProductForm || editProduct ? (
        <AddProductForm 
          isEditing={!!editProduct}
          editProduct={editProduct}
          onSave={handleSaveProduct} 
          onCancel={() => {
            setShowAddProductForm(false)
            setEditProduct(null)
          }} 
        />
      ) : (
        <>
          <ProductsHeader 
            onAddProductClick={handleAddProductClick} 
            onSearchChange={handleSearchChange}
            searchQuery={searchQuery}
          />
          <ProductsTable 
            onEditProduct={handleEditProduct}
            searchQuery={searchQuery}
          />
        </>
      )}
    </>
  )
}