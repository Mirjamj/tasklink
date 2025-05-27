'use client'

import { useAuth } from '@/context/authContext'
import { Loader2Icon } from 'lucide-react'
import React from 'react'
import { Toaster } from 'react-hot-toast'

function ApplicationLayout({ authenticated, unauthenticated }) {
  const { user, authLoaded } = useAuth()

  // Show a loading spinner while authentication state is being determined
  if (!authLoaded) {
    return (
      <div className='flex items-center justify-center h-[80svh]'>
        <Loader2Icon className='size-10 animate-spin text-blue-600' />
      </div>
    )
  }

  return (
    <>
      {
        // Render either authenticated or unauthenticated content based on user status
        user === null
          ? unauthenticated
          : authenticated
      }

      {/* Toast notifications displayed at the top center */}
      <Toaster
        position="top-center"
        reverseOrder={false} />
    </>
  )
}

export default ApplicationLayout