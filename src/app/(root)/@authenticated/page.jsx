'use client'

import React from 'react'
import { Header } from '@/components/header'
import { TaskColumn } from '@/components/tasks/task-column'
import { isValid, parse } from 'date-fns'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/authContext'

// HomePage component - renders the main dashboard view for the logged-in user
function HomePage() {

  // Retrieve the "date" query parameter from the URL
  const searchParams = useSearchParams()
  const date = searchParams.get('date')

  // Parse the date string or fall back to today's date
  const parsed = date
    ? parse(date, 'yyyy-MM-dd', new Date())
    : new Date()

  // Validate the parsed date; default to today if invalid
  const selectedDate = isValid(parsed) ? parsed : new Date()

  // Get the current logged-in user
  const { user } = useAuth()

  return (
    <>
      {/* Page header component */}
      <Header />
      <div className='mt-10 pb-20'>

        {/* Main content area showing the user's tasks for the selected date */}
        <TaskColumn date={selectedDate} user={user} />
      </div>
    </>
  )
}

export default HomePage