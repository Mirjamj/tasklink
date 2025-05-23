'use client'

import { useAuth } from '@/context/authContext'
import { Loader2Icon } from 'lucide-react'
import React from 'react'
import { Toaster } from 'react-hot-toast'

function ApplicationLayout({ authenticated, unauthenticated }) {

  const { user, authLoaded } = useAuth()

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
        user === null
          ? unauthenticated
          : authenticated
      }
      <Toaster
        position="top-center"
        reverseOrder={false} />
    </>
  )
}

export default ApplicationLayout