"use client"
import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
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
import { useAuth } from "@/context/authContext"

// Define validation schema for the change password form using Zod
const formSchema = z.object({
  currentPassword: z.string().nonempty({ message: 'Current password required' }),
  newPassword: z.string().min(6, { message: 'Password must contain at least 6 characters' }),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Password not matching',
  path: ['confirmPassword']
})

export const ChangePasswordForm = ({ className }) => {
  const { changePassword, loading } = useAuth()

  // Initialize react-hook-form with validation schema and default values
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  // Handle form submission
  function onSubmit(values) {
    changePassword(values.currentPassword, values.newPassword)
  }

  return (
    <div>
      <h2 className="font-semibold text-lg mb-5">Change password</h2>

      {/* Form wrapper provides context to children */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-10">

          {/* Current password field */}
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current password</FormLabel>
                <FormControl>
                  <Input type='password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* New password field */}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input type='password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm new password field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm new password</FormLabel>
                <FormControl>
                  <Input type='password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit button, shows loading state */}
          <Button disabled={loading} type="submit" className='md:w-40'>{loading ? 'Updating...' : 'Change password'}</Button>
        </form>
      </Form>

    </div>
  )
}
