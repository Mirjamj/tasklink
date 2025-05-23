
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

export const loginFormSchema = z.object({
  email: z.string().email({ message: 'Please provide a valid email address.' }),
  password: z.string().nonempty({ message: 'You need to enter a password.' })
})


export const LoginForm = ({ changeForm }) => {

  const [errorMessage, setErrorMessage] = useState(null)
  const { register, loading, login } = useAuth()


  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  async function onSubmit(values) {
    try {
      await login(values.email, values.password)
    } catch (error) {
      const errorMessage = getErrorMessage(error.code)
      setErrorMessage(errorMessage)
    }
    console.log(values)
  }

  return (
    <>
      <h2 className='font-semibold text-xl text-center mb-5'>Log in to your account</h2>
      {errorMessage && <p className='text-red-700 text-center text-sm'>{errorMessage}</p>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          <p>Do you need to create an account? <span onClick={() => changeForm('register')} className='underline cursor-pointer'>Register here</span>
          </p>
          <Button disabled={loading} className='w-full sm:w-auto' type="submit">Log in</Button>
        </form>
      </Form>
    </>
  )
}
