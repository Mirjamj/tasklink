'use client'

import { useAuth } from '@/context/authContext'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

//Layout component that restricts access to admin-only content.
//Redirects non-admin users to the homepage.
function AdminLayout({ children }) {
  const { isAdmin } = useAuth()
  const router = useRouter()

  // Redirect to home if user is not an admin
  useEffect(() => {
    if (!isAdmin()) {
      router.replace('/')
    }
  })

  // Prevent rendering layout content until access is confirmed
  if (!isAdmin()) {
    return null
  }

  return (
    <>{children}</>
  )
}

export default AdminLayout