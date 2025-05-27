'use client'
import { TaskColumn } from '@/components/tasks/task-column'
import { useUsers } from '@/context/usersContext'
import { isValid, parse } from 'date-fns'
import { useSearchParams } from 'next/navigation'
import React from 'react'

//Displays a list of task columns, one for each user-based on a selected date.
//The date is retrieved from the search params or defaults to today.
export const AllUsersTasksList = () => {

  // Get and parse the date from URL search params
  const searchParams = useSearchParams()
  const date = searchParams.get('date')
  const parsed = date
    ? parse(date, 'yyyy-MM-dd', new Date())
    : new Date()

  // Use parsed date if valid, otherwise default to today
  const selectedDate = isValid(parsed) ? parsed : new Date()

  // Fetch all users from custom hook
  const { users } = useUsers()

  return (
    <>
      {/* Render a task column for each user */}
      {
        !!users.length && users.map(user => {
          return <TaskColumn key={user.uid} date={selectedDate} user={user} className='w-72' />
        })
      }
    </>
  )
}
