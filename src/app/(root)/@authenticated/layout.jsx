import { Navbar } from '@/components/ui/navbar'
import React from 'react'

// Layout component - wraps every page with a consistent layout structure
function Layout({ children }) {
  return (
    <>
      {/* Navigation bar displayed at the top of every page */}
      <Navbar />

      {/* Main content area where individual pages are rendered */}
      <main>
        {children}
      </main>
    </>
  )
}

export default Layout