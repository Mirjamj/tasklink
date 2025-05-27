'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuth } from '@/context/authContext'
import { getErrorMessage } from '@/lib/getFirebaseError'

// Schema to validate login form inputs using Zod
export const loginFormSchema = z.object({
  email: z.string().email({ message: 'Please provide a valid email address.' }),
  password: z.string().nonempty({ message: 'You need to enter a password.' })
})

export const LoginForm = ({ changeForm }) => {

  // State to hold and display any authentication error message
  const [errorMessage, setErrorMessage] = useState(null)

  // Custom hook to handle login logic and loading state
  const { loading, login } = useAuth()

  // Initialize react-hook-form with Zod schema resolver
  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  // Handles form submission and login logic
  async function onSubmit(values) {
    try {
      await login(values.email, values.password)
    } catch (error) {
      const errorMessage = getErrorMessage(error.code)
      setErrorMessage(errorMessage)
    }
  }

  return (
    <>
      <h2 className='font-semibold text-xl text-center mb-5'>Log in to your account</h2>

      {/* Show error message if login fails */}
      {errorMessage && <p className='text-red-700 text-center text-sm'>{errorMessage}</p>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

          {/* Email input field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type='email' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password input field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type='password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Switch to registration form if user doesn't have an account */}
          <p>Do you need to create an account? <span onClick={() => changeForm('register')} className='underline cursor-pointer'>Register here</span>
          </p>

          {/* Submit button, disabled while loading */}
          <Button disabled={loading} className='w-full sm:w-auto' type="submit">Log in</Button>
        </form>
      </Form>
    </>
  )
}
