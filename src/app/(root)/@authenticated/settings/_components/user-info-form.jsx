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

const formSchema = z.object({
  displayName: z.string()
    .nonempty({ message: 'Please provide a user name.' })
    .min(3, { message: 'Username must contain at least three characters.' })
    .max(20, { message: 'Username cannot contain more than 20 characters.' }),
  email: z.string().email({ message: 'Please provide a valid email address.' })
})

export const UserInfoForm = ({ user }) => {

  const { updateUser, loading } = useAuth()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: user.displayName || "",
      email: user.email || '',
    },
  })

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
          <Button disabled={loading} type="submit" className='md:w-40'>{loading ? 'Updating...' : 'Update username'}</Button>
        </form>
      </Form>
    </div>
  )
}
