'use client'

import React from 'react'
import { Header } from '@/components/header'
import { TaskColumn } from '@/components/tasks/task-column'

import { isValid, parse } from 'date-fns'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/authContext'

function HomePage() {

  const searchParams = useSearchParams()
  const date = searchParams.get('date')
  const parsed = date
    ? parse(date, 'yyyy-MM-dd', new Date())
    : new Date()
  const selectedDate = isValid(parsed) ? parsed : new Date()

  const { user } = useAuth()

  return (
    <>
      <Header />
      <div className='mt-10 pb-20'>
        <TaskColumn date={selectedDate} user={user} />
      </div>
    </>
  )
}

export default HomePage