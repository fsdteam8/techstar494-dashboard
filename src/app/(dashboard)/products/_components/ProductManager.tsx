"use client"

import { useState } from "react"
import AddProductForm from "./AddProductForm"
import ProductsTable from "./ProductsTable"
import ProductsHeader from "./ProductsHeader"


export default function ProductManager() {
  const [showAddProductForm, setShowAddProductForm] = useState(false)

  const handleAddProductClick = () => {
    setShowAddProductForm(true)
  }

  const handleSaveProduct = () => {
    // Logic to save the product
    console.log("Product saved!")
    setShowAddProductForm(false) // Go back to product list after saving
  }

  return (
    <>
      {showAddProductForm ? (
        <AddProductForm onSave={handleSaveProduct} onCancel={() => setShowAddProductForm(false)} />
      ) : (
        <>
          <ProductsHeader onAddProductClick={handleAddProductClick} />
          <ProductsTable />
        </>
      )}
    </>
  )
}
