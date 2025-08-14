'use client'

import React, { useState } from 'react'
import UsersContainer from './_components/users-container'
import UsersHeader from './_components/users-header'

const UserPage: React.FC = () => {
  const [search, setSearch] = useState<string>('')

  return (
    <div>
      <UsersHeader search={search} setSearch={setSearch} />
      <UsersContainer search={search} />
    </div>
  )
}

export default UserPage
