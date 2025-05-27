'use client'

import { cn } from '@/lib/utils'
import React, { useRef, useState } from 'react'
import { TaskList } from './task-list'
import { useTasks } from '@/context/tasksContext'
import { useAuth } from '@/context/authContext'
import { Switch } from '../ui/switch'
import { TaskProgress } from './task-progress'
import { TaskReorder } from './task-reorder'

export const TaskColumn = ({ user, date, className }) => {
  // Local state to track whether the task list is in reorder mode
  const [isReordering, setIsReordering] = useState(false)
  // Local copy of tasks used for reordering before saving
  const [localTasks, setLocalTasks] = useState([])
  // Ref to keep track of tasks moved and their new order during reordering
  const movedTasks = useRef([])

  // Task-related hooks and functions
  const { getTasksByUserForDate, completeTask, saveReorder } = useTasks()
  // Get all tasks assigned to the user for the specified date
  const tasks = getTasksByUserForDate(user.uid, date)
  // Filter tasks to only those not completed
  const notCompleted = tasks.filter(task => !task.completed)

  // Auth hook to determine if current user is admin
  const { isAdmin } = useAuth()

  // Handler to mark a task as completed
  const handleComplete = async (task) => {
    completeTask(task.id)
  }

  // Initialize reorder mode by creating a deep copy of tasks that are not completed
  const startReorder = () => {
    const deep = tasks
      .filter(t => !t.completed)
      .map(t => ({ ...t }))

    movedTasks.current = [] // Reset moved tasks tracking
    setLocalTasks(deep) // Set localTasks state to this deep copy
    setIsReordering(true) // Enable reorder mode
  }

  // Handler for toggling reorder switch
  const handleCheckChange = (checked) => {
    if (!checked) {
      // When disabling reorder mode, save changes only if order has changed
      const payload = movedTasks.current.filter(mt => {
        const original = localTasks.find(t => t.id === mt.id)
        return original && original.order !== mt.newOrder
      })

      if (payload.length > 0) {
        saveReorder(localTasks, payload) // Persist reordered tasks
      }
    } else {
      // When enabling reorder mode, initialize local state
      startReorder()
    }
    setIsReordering(checked)
  }

  return (
    <div className={cn('border-3 max-w-96 p-5 mx-auto rounded flex flex-col', className)}>
      {/* Display progress bar showing completed vs total tasks */}
      <TaskProgress total={tasks.length} user={user} completed={tasks.length - notCompleted.length} className='mb-5' />

      {/* Show reorder toggle switch only to admin users */}
      {
        isAdmin() && (
          <div className='flex items-center justify-between mb-5'>
            <span className='font-semibold'>Sort</span>
            <Switch
              checked={isReordering}
              onCheckedChange={handleCheckChange}
              className='cursor-pointer'
            />
          </div>
        )
      }
      <div className="flex-1">
        {/* Render either the reorder UI or the regular task list */}
        {
          isReordering
            ? <TaskReorder tasks={localTasks} setTasks={setLocalTasks} movedTasks={movedTasks} />
            : <TaskList tasks={notCompleted} handleComplete={handleComplete} />
        }
      </div>
    </div>
  )
}
