'use client'

import React from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from '@/context/authContext'
import { LogOutIcon, SettingsIcon } from 'lucide-react'
import Link from 'next/link'


export const AvatarDropdown = () => {

  const { user, logout, isAdmin } = useAuth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className='size-9 cursor-pointer uppercase'>
          <AvatarFallback>{user?.displayName?.slice(0, 2 || '?')}</AvatarFallback>
        </Avatar>

      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-44'>

        {
          isAdmin() && (
            <>
              <DropdownMenuItem asChild className='cursor-pointer md:hidden'>
                <Link href='/all' className='flex items-center gap-2'>
                  Staff overview
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className='cursor-pointer md:hidden'>
                <Link href='/add' className='flex items-center gap-2'>
                  Add tasks
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )
        }

        <DropdownMenuItem asChild className='cursor-pointer'>
          <Link href='/settings' className='flex items-center gap-2'>
            <SettingsIcon className='size-6 md:size-4' />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout} className='cursor-pointer'>
          <LogOutIcon className='size-6 md:size-4' />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu >

  )
}
