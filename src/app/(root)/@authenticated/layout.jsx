import { Navbar } from '@/components/ui/navbar'
import React from 'react'

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>
        {children}
      </main>
    </>
  )
}

export default Layout