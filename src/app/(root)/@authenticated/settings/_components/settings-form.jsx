import { ModeToggle } from '@/components/ui/mode-toggle'
import React from 'react'
import { UserInfoForm } from './user-info-form'
import { ChangePasswordForm } from './change-password-form'

// SettingsForm component displays user settings.
// Conditionally renders controls based on whether the settings belong to the current user.
export const SettingsForm = ({ user, isOwn }) => {
  return (
    <>
      <div className='flex flex-col gap-10'>

        {/* Only show theme toggle if this is the user's own settings */}
        {
          isOwn && (
            <div className='flex items-center justify-between mb-10'>
              <p>Color theme:</p>
              <ModeToggle />
            </div>
          )
        }

        {/* Display form to edit user information */}
        <UserInfoForm user={user} />

        {/* Only show password change form if this is the user's own settings */}
        {
          isOwn && <ChangePasswordForm />
        }
      </div>
    </>
  )
}
