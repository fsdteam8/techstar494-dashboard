'use client'
import React, { useState } from 'react'
import SubscriberHeader from './_components/subscriber-header'
import SubscriberContainer from './_components/subscriber-container'

const SubscribersPage = () => {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  return (
    <div>
      <SubscriberHeader search={search} setSearch={setSearch} />
      <SubscriberContainer
        search={search}
        filter={filter}
        setFilter={setFilter}
      />
    </div>
  )
}

export default SubscribersPage
