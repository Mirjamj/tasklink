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

// Schema for validating user info form input using Zod
const formSchema = z.object({
  displayName: z.string()
    .nonempty({ message: 'Please provide a user name.' })
    .min(3, { message: 'Username must contain at least three characters.' })
    .max(20, { message: 'Username cannot contain more than 20 characters.' }),
  email: z.string().email({ message: 'Please provide a valid email address.' })
})

// Component for updating the user's display name.
// The email field is shown but disabled to prevent edits.
export const UserInfoForm = ({ user }) => {
  const { updateUser, loading } = useAuth()

  // Initialize form with Zod validation and default values from the user object
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: user.displayName || "",
      email: user.email || '',
    },
  })

  // Submit handler to update only the display name
  function onSubmit(values) {
    const newUserData = {
      displayName: values.displayName
    }
    updateUser(user, newUserData)
  }

  return (
    <div>
      <h2 className="font-semibold text-lg mb-5">Change username</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-10">

          {/* Email field - shown for reference but not editable */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email:</FormLabel>
                <FormControl>
                  <Input disabled {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Editable username field */}
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username:</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit button with loading state */}
          <Button disabled={loading} type="submit" className='md:w-40'>{loading ? 'Updating...' : 'Update username'}</Button>
        </form>
      </Form>
    </div>
  )
}
