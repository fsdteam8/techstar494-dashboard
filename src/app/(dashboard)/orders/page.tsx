'use client'
import React, { useState } from 'react'
import OrderContainer from './_components/order-container'
import OrderHeader from './_components/order-header'

const OderPage: React.FC = () => {
  const [search, setSearch] = useState<string>('')
  return (
    <div>
      <OrderHeader search={search} setSearch={setSearch} />
      <OrderContainer search={search} />
    </div>
  )
}

export default OderPage
