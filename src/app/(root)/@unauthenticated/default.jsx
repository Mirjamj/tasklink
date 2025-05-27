import React from 'react'
import { AuthFormView } from './_components/auth-form-view'

// PublicPage is a landing page shown to unauthenticated users
function PublicPage() {
  return (
    <div>
      <h2 className='text-center max-w-2xl text-2xl my-20 mx-auto'>Welcome to TaskLink! Log in to access your workspace.</h2>

      {/* Authentication form (login/register) */}
      <AuthFormView />
    </div>
  )
}

export default PublicPage