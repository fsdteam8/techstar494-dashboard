'use client'
import React, { useState } from 'react'
import OrderContainer from './_components/order-container'
import OrderHeader from './_components/order-header'

const OderPage: React.FC = () => {
  const [search, setSearch] = useState<string>('')
  const [filter, setFilter] = useState<string>('')
  return (
    <div>
      <OrderHeader
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
      />
      <OrderContainer search={search} filter={filter} />
    </div>
  )
}

export default OderPage
