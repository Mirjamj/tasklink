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

// Define shared base schema for all task types
const base = z.object({
  title: z.string().nonempty({ message: 'Add task' }),
  ownerId: z.string().nonempty({ message: 'Choose user' }),
})

// Schema for a one-time task with a single date
const single = base.extend({
  recurring: z.literal('none'),
  date: z.date(),
})

// Schema for a repeating task with multiple dates
const multiple = base.extend({
  recurring: z.literal('multiple'),
  dateMultiple: z.array(z.date()).min(1),
})

// Schema for a task that spans a range of dates
const range = base.extend({
  recurring: z.literal('range'),
  dateRange: z.object({
    from: z.date(),
    to: z.date()
  })
})

// Combine all task schemas into one using discriminated union
const formSchema = z.discriminatedUnion('recurring', [
  single,
  multiple,
  range
])

export const AddTaskForm = () => {
  // Get default query params (e.g. preselected user/date)
  const searchParams = useSearchParams()
  const presetDate = searchParams.get('date')
  const presetUserId = searchParams.get('userId')

  // Custom hooks for data and actions
  const { users } = useUsers()
  const { addTask, loading } = useTasks()

  // State for UI feedback
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const router = useRouter()

  // Initialize react-hook-form with zod validation
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      ownerId: presetUserId ?? '',
      recurring: 'none',
      date: presetDate ? parse(presetDate, 'yyyy-MM-dd', new Date()) ?? new Date() : new Date()
    },
  })

  // Watch the selected recurring type to conditionally render inputs
  const recurringType = form.watch('recurring')

  // Submit handler
  async function onSubmit(values) {
    const base = {
      title: values.title,
      ownerId: values.ownerId,
    }

    try {
      setSubmitted(true)

      // Create single task
      if (values.recurring === 'none') {
        await addTask({ ...base, date: values.date })
      }

      // Create one task per selected date
      if (values.recurring === 'multiple') {
        await Promise.all(
          values.dateMultiple.map(d => addTask({ ...base, date: d }))
        )
      }

      // Create one task for each day in the range
      if (values.recurring === 'range') {
        const days = eachDayOfInterval({ start: values.dateRange.from, end: values.dateRange.to })
        await Promise.all(
          days.map(d => addTask({ ...base, date: d }))
        )
      }

      // Reset form and navigate to homepage
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-10">

        {/* Task title input */}
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

        {/* Assignee selector with searchable dropdown */}
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

        {/* Dropdown to choose recurrence type */}
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

        {/* Conditionally render calendar input based on recurrence type */}
        <FormLabel className='md:text-center'>Select date</FormLabel>
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
                    className='w-57'
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
                    className='w-57'
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
                    className='w-57'
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        }
        {errorMessage && <p className='text-sm text-red-600'>{errorMessage}</p>}

        {/* Submit button */}
        <Button disabled={loading || submitted} className='w-50' type="submit">{loading ? 'Creating...' : 'Create task'}</Button>
      </form>
    </Form >
  )
}
