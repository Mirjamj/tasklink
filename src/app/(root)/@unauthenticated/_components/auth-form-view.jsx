'use client'

import React, { useState } from 'react'
import { LoginForm } from './login-form'
import { RegisterForm } from './register-form'

// AuthFormView component - toggles between the login and registration forms
export const AuthFormView = () => {

  // State to determine which form to show: login (true) or register (false)
  const [showLogin, setShowLogin] = useState(true)

  // Handler to switch between login and register views
  const changeForm = (formName) => {
    if (formName === 'login') {
      setShowLogin(true)
    } else if (formName === 'register') {
      setShowLogin(false)
    }
  }

  return (
    <div className='border max-w-2xl mx-auto p-4 rounded-2xl'>
      {/* Conditionally render the login or register form based on state */}
      {
        showLogin
          ? <LoginForm changeForm={changeForm} />
          : <RegisterForm changeForm={changeForm} />
      }
    </div>
  )
}
