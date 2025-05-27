'use client'

import { ArrowDownUp } from 'lucide-react'
import { Reorder } from 'motion/react'
import React, { useState } from 'react'

export const TaskReorder = ({ tasks, setTasks, movedTasks }) => {

  // Track the currently dragged (active) task ID
  const [active, setActive] = useState(null)

  // Handler called whenever the task list order changes via drag-and-drop
  const handleReorder = (list) => {
    // Find the active task and its index in the reordered list
    const activeTask = list.find(t => t.id === active)
    const activeIndex = list.findIndex(t => t.id === active)

    // Get the order values of the previous and next tasks
    const prev = list[activeIndex - 1]?.order
    const next = list[activeIndex + 1]?.order

    // Calculate a new sparse order value between prev and next
    const newOrder = getSparseOrder(prev, next)

    // Update or add the task’s new order in the movedTasks ref for tracking
    if (movedTasks.current.find(t => t.id === activeTask.id)) {
      const index = movedTasks.current.findIndex(t => t.id === activeTask.id)
      movedTasks.current[index].newOrder = newOrder
    } else {
      movedTasks.current.push({ id: activeTask.id, newOrder })
    }

    // Update local state to reflect the reordered list
    setTasks(list)
  }

  // Utility to calculate a new order number between two numbers, ensuring spacing
  const getSparseOrder = (prev, next) => {
    if (prev === undefined) return next - 1000 // Placing before the first item
    if (next === undefined) return prev + 1000 // Placing after the last item

    // Otherwise, place exactly in the middle between prev and next
    return prev + Math.floor((next - prev) / 2)
  }

  return (
    <Reorder.Group
      axis='y'
      as='ul'
      values={tasks}
      onReorder={handleReorder}
      className='space-y-3 w-full'
    >
      {
        tasks.map(task => (
          <Reorder.Item
            as='li'
            key={task.id}
            onDragStart={() => setActive(task.id)}
            onDragEnd={() => setActive(null)}
            value={task}
            className='flex items-center gap-3 p-4 my-4 shadow-sm bg-blue-400/20 rounded cursor-pointer'
          >
            <ArrowDownUp className='w-4 h-4 flex-shrink-0' />
            <span>{task.title}</span>
          </Reorder.Item>
        ))
      }
    </Reorder.Group>
  )
}
