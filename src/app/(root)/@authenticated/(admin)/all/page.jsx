import { Header } from '@/components/header'
import React from 'react'
import { AllUsersTasksList } from './_components/all-users-tasks-list'

function AllTasksPage() {
  return (
    <>
      <Header />
      <div className='mt-10 flex flex-col md:flex-row gap-4 overflow-x-auto pb-20'>
        <AllUsersTasksList />
      </div>
    </>
  )
}

export default AllTasksPage