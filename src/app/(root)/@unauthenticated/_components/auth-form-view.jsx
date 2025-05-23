'use client'

import React, { useState } from 'react'
import { LoginForm } from './login-form'
import { RegisterForm } from './register-form'

export const AuthFormView = () => {

  const [showLogin, setShowLogin] = useState(true)

  const changeForm = (formName) => {
    if (formName === 'login') {
      setShowLogin(true)
    } else if (formName === 'register') {
      setShowLogin(false)
    }
  }

  return (
    <div className='border max-w-2xl mx-auto p-4 rounded-2xl'>
      {
        showLogin
          ? <LoginForm changeForm={changeForm} />
          : <RegisterForm changeForm={changeForm} />
      }
    </div>
  )
}
