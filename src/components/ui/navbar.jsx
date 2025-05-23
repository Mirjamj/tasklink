'use client'

import Link from 'next/link'
import React from 'react'
import { Button } from './button'
import { AvatarDropdown } from './avatar-dropdown'
import { useAuth } from '@/context/authContext'
import { useSearchParams } from 'next/navigation'

export const Navbar = () => {



  const { isAdmin } = useAuth()

  const searchParams = useSearchParams()
  const date = searchParams.get('date')

  return (
    <nav className='flex items-center justify-between pb-10'>
      <div>
        <h1 className='block sm:hidden sr-only'>TaskLink</h1>
        <Link href='/' className='text-3xl text-blue-400 font-bold hidden sm:block uppercase'><h1>Task<span className='text-gray-900 dark:text-gray-200'>Link</span></h1></Link>
        <Link href='/' className='text-3xl text-blue-400 font-bold block sm:hidden'><h1>T<span className='text-gray-500 dark:text-gray-200'>L</span></h1></Link>
      </div>
      <div className='flex items-center gap-1'>
        <Button asChild variant='link' size='lg'>
          <Link href={`${date ? `/?date=${date}` : '/'}`}>My tasks</Link>
        </Button>

        {
          isAdmin() && (
            <>
              <Button asChild variant='link' size='lg' className='hidden md:flex'>
                <Link href={`${date ? `/all/?date=${date}` : '/all'}`}>Staff overview</Link>
              </Button>
              <Button asChild variant='link' size='lg' className='hidden md:flex'>
                <Link href='/add'>Add tasks</Link>
              </Button>
            </>
          )
        }

        <AvatarDropdown />
      </div>
    </nav>
  )
}
