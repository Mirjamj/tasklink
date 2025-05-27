'use client'

import { addDays, format, isValid, parse } from 'date-fns'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { DatePicker } from './date-picker'

export const Header = () => {

  // Get the current 'date' query parameter from the URL
  const searchParams = useSearchParams()
  const date = searchParams.get('date')

  const router = useRouter()
  const pathName = usePathname()

  // Parse the date string from the URL using 'yyyy-MM-dd' format,
  // fallback to current date if no date is present
  const parsed = date
    ? parse(date, 'yyyy-MM-dd', new Date())
    : new Date()

  // Validate the parsed date, use current date if invalid
  const selectedDate = isValid(parsed) ? parsed : new Date

  // Function to update the URL with a new date value
  const navigateToDate = (newDate) => {
    const formatted = format(newDate, 'yyy-MM-dd')
    const params = new URLSearchParams(searchParams.toString())
    params.set('date', formatted)
    router.push(`${pathName}?${params.toString()}`)
  }

  return (
    <div className='flex items-center justify-center gap-4'>
      {/* Button to navigate to previous day */}
      <Button variant='outline' onClick={() => navigateToDate(addDays(selectedDate, -1))}>
        <ChevronLeftIcon />
      </Button>

      {/* Date picker component to select a specific date */}
      <DatePicker
        date={selectedDate}
        onDateChange={navigateToDate}
      />

      {/* Button to navigate to next day */}
      <Button variant='outline' onClick={() => navigateToDate(addDays(selectedDate, 1))}>
        <ChevronRightIcon />
      </Button>
    </div>
  )
}
