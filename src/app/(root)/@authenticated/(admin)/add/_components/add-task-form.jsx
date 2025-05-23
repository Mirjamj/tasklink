'use client'

import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
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
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useRouter, useSearchParams } from 'next/navigation'
import { eachDayOfInterval, parse } from 'date-fns'
import { useUsers } from '@/context/usersContext'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from '@/components/ui/calendar'
import { useTasks } from '@/context/tasksContext'

const base = z.object({
  title: z.string().nonempty({ message: 'Add task' }),
  ownerId: z.string().nonempty({ message: 'Choose user' }),
})

const single = base.extend({
  recurring: z.literal('none'),
  date: z.date(),
})

const multiple = base.extend({
  recurring: z.literal('multiple'),
  dateMultiple: z.array(z.date()).min(1),
})

const range = base.extend({
  recurring: z.literal('range'),
  dateRange: z.object({
    from: z.date(),
    to: z.date()
  })
})

const formSchema = z.discriminatedUnion('recurring', [
  single,
  multiple,
  range
])


export const AddTaskForm = () => {

  const searchParams = useSearchParams()
  const presetDate = searchParams.get('date')
  const presetUserId = searchParams.get('userId')

  const { users } = useUsers()
  const { addTask, loading } = useTasks()
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const router = useRouter()


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      ownerId: presetUserId ?? '',
      recurring: 'none',
      date: presetDate ? parse(presetDate, 'yyyy-MM-dd', new Date()) ?? new Date() : new Date()
    },
  })

  const recurringType = form.watch('recurring')

  async function onSubmit(values) {
    const base = {
      title: values.title,
      ownerId: values.ownerId,
    }

    try {
      setSubmitted(true)

      if (values.recurring === 'none') {
        await addTask({ ...base, date: values.date })
      }
      if (values.recurring === 'multiple') {
        await Promise.all(
          values.dateMultiple.map(d => addTask({ ...base, date: d }))
        )
      }
      if (values.recurring === 'range') {
        const days = eachDayOfInterval({ start: values.dateRange.from, end: values.dateRange.to })
        await Promise.all(
          days.map(d => addTask({ ...base, date: d }))
        )
      }

      form.reset()
      router.push('/')
    } catch (error) {
      console.error(error)
      setErrorMessage('Oops! Something went wrong, please try again later.')
      setSubmitted(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"

          render={({ field }) => (
            <FormItem>
              <FormLabel>Task</FormLabel>
              <FormControl>
                <Input className='w-70' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ownerId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Assigne</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-70 justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? users.find(
                          (user) => user.uid === field.value
                        )?.displayName
                        : "Select user"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-70 p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search users..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No users found.</CommandEmpty>
                      <CommandGroup>
                        {users.map((user) => (
                          <CommandItem
                            value={user.displayName.toLowerCase()}
                            key={user.uid}
                            onSelect={() => {
                              form.setValue("ownerId", user.uid)
                            }}
                          >
                            {user.displayName}
                            <Check
                              className={cn(
                                "ml-auto",
                                user.uid === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="recurring"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select deadline</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className='w-70'>
                    <SelectValue placeholder="Choose deadline" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Non repeating</SelectItem>
                  <SelectItem value="multiple">Repeating</SelectItem>
                  <SelectItem value="range">From - To</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {recurringType === 'none' && 'Select if the task is repeating.'}
                {recurringType === 'multiple' && 'Select recurring days for task.'}
                {recurringType === 'range' && 'Select time period for task.'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {
          recurringType === 'none' && (
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    className='w-65'
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        }

        {
          recurringType === 'multiple' && (
            <FormField
              control={form.control}
              name="dateMultiple"
              render={({ field }) => (
                <FormItem>
                  <Calendar
                    mode="multiple"
                    selected={field.value}
                    onSelect={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        }

        {
          recurringType === 'range' && (
            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem>
                  <Calendar
                    mode="range"
                    selected={field.value}
                    onSelect={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        }

        {errorMessage && <p className='text-sm text-red-600'>{errorMessage}</p>}
        <Button disabled={loading || submitted} type="submit">{loading ? 'Creating...' : 'Create task'}</Button>
      </form>
    </Form >
  )
}
