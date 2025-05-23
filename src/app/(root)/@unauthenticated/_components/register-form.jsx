
// Use client not needed, parent is a use client because of the import of RegisterForm.
// (Does not work with {children})
'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuth } from '@/context/authContext'
import { getErrorMessage } from '@/lib/getFirebaseError'

export const registerFormSchema = z.object({
  displayName: z.string().nonempty({ message: 'Please provide a user name.' })
    .min(3, { message: 'Username must contain at least three characters.' })
    .max(20, { message: 'Username cannot contain more than 20 characters.' }),
  email: z.string().email({ message: 'Please provide a valid email address.' }),
  password: z.string().nonempty({ message: 'You need to enter a password.' })
    .min(6, { message: 'Password must contain at least 6 characters.' }),
  confirmPassword: z.string().nonempty({ message: 'Please confirm your password.' })
}).refine(data => data.password === data.confirmPassword, {
  message: 'Password not matching',
  path: ['confirmPassword']
})


export const RegisterForm = ({ changeForm }) => {

  const [errorMessage, setErrorMessage] = useState(null)
  const { register, loading } = useAuth()

  const form = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  })

  async function onSubmit(values) {
    try {
      const { email, password, displayName } = values
      await register(email, password, displayName)

    } catch (error) {
      const errorMessage = getErrorMessage(error.code)
      setErrorMessage(errorMessage)
    }

    console.log(values)
  }

  return (
    <>
      <h2 className='font-semibold text-xl text-center mb-5'>Create new account</h2>
      {errorMessage && <p className='text-red-700 text-center text-sm'>{errorMessage}</p>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Choose a username between 3 and 20 characters.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type='email' {...field} />
                </FormControl>
                <FormDescription>
                  Please use your company email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type='password' {...field} />
                </FormControl>
                <FormDescription>
                  Your password must contain at least 6 characters.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input type='password' {...field} />
                </FormControl>
                <FormDescription>
                  Please confirm your password.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <p>Do you already have an account? <span onClick={() => changeForm('login')} className='underline cursor-pointer'>Log in here</span>
          </p>
          <Button disabled={loading} className='w-full sm:w-auto' type="submit">Create account</Button>
        </form>
      </Form>
    </>
  )
}
