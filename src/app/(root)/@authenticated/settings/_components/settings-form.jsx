import { ModeToggle } from '@/components/ui/mode-toggle'
import React from 'react'
import { UserInfoForm } from './user-info-form'
import { ChangePasswordForm } from './change-password-form'

export const SettingsForm = ({ user, isOwn }) => {
  return (
    <>
      <div className='flex flex-col gap-10'>
        {
          isOwn && (
            <div className='flex items-center justify-between mb-10'>
              <p>Color theme:</p>
              <ModeToggle />
            </div>
          )
        }
        <UserInfoForm user={user} />
        {
          isOwn && <ChangePasswordForm />
        }
      </div>
    </>
  )
}
