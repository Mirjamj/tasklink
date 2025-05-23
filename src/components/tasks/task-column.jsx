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

  const [isReordering, setIsReordering] = useState(false)
  const [localTasks, setLocalTasks] = useState([])

  const movedTasks = useRef([])

  const { getTasksByUserForDate, completeTask, saveReorder } = useTasks()
  const tasks = getTasksByUserForDate(user.uid, date)

  const notCompleted = tasks.filter(task => !task.completed)

  const { isAdmin } = useAuth()

  const handleComplete = async (task) => {
    completeTask(task.id)
  }

  const startReorder = () => {
    const deep = tasks
      .filter(t => !t.completed)
      .map(t => ({ ...t }))

    movedTasks.current = []
    setLocalTasks(deep)
    setIsReordering(true)
  }

  const handleCheckChange = (checked) => {
    if (!checked) {
      const payload = movedTasks.current.filter(mt => {
        const original = localTasks.find(t => t.id === mt.id)
        return original && original.order !== mt.newOrder
      })

      if (payload.length > 0) {
        saveReorder(localTasks, payload)
      }
    } else {
      startReorder()
    }
    setIsReordering(checked)
  }

  return (
    <div className={cn('border-3 max-w-96 p-5 mx-auto rounded flex flex-col', className)}>
      <TaskProgress total={tasks.length} user={user} completed={tasks.length - notCompleted.length} className='mb-5' />
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
        {
          isReordering
            ? <TaskReorder tasks={localTasks} setTasks={setLocalTasks} movedTasks={movedTasks} />
            : <TaskList tasks={notCompleted} handleComplete={handleComplete} />
        }
      </div>
    </div>
  )
}
