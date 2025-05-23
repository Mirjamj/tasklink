'use client'

import { ArrowDownUp } from 'lucide-react'
import { Reorder } from 'motion/react'
import React, { useState } from 'react'

export const TaskReorder = ({ tasks, setTasks, movedTasks }) => {

  const [active, setActive] = useState(null)

  const handleReorder = (list) => {
    const activeTask = list.find(t => t.id === active)
    const activeIndex = list.findIndex(t => t.id === active)

    const prev = list[activeIndex - 1]?.order
    const next = list[activeIndex + 1]?.order

    const newOrder = getSparseOrder(prev, next)

    if (movedTasks.current.find(t => t.id === activeTask.id)) {
      const index = movedTasks.current.findIndex(t => t.id === activeTask.id)
      movedTasks.current[index].newOrder = newOrder
    } else {
      movedTasks.current.push({ id: activeTask.id, newOrder })
    }

    setTasks(list)
  }

  const getSparseOrder = (prev, next) => {
    if (prev === undefined) return next - 1000
    if (next === undefined) return prev + 1000

    return prev + Math.floor((next - prev) / 2)
  }

  return (
    <Reorder.Group
      axis='y'
      as='ul'
      values={tasks}
      onReorder={handleReorder}
      className='spacy-y-3 w-full'
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
