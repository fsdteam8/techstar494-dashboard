'use client'

import React, { useState } from 'react'
import UsersContainer from './_components/users-container'
import UsersHeader from './_components/users-header'

const UserPage: React.FC = () => {
  const [search, setSearch] = useState<string>('')
  const [filter, setFilter] = useState<string>('')

  return (
    <div>
      <UsersHeader
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
      />
      <UsersContainer search={search} filter={filter} />
    </div>
  )
}

export default UserPage
