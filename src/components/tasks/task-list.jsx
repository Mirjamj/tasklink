import React from 'react'
import { Task } from './task'
import { AnimatePresence, motion } from 'motion/react'

export const TaskList = ({ tasks, handleComplete }) => {
  return (
    // Container with animation layout support for smooth reordering
    <motion.div className='space-y-3 w-full' layout>

      {/* AnimatePresence enables exit animations when tasks are removed */}
      <AnimatePresence mode='popLayout'>
        {
          // Render each task with a unique key, passing down handler and index
          tasks.map((task, index) => (
            <Task key={task.id} task={task} handleComplete={handleComplete} index={index} />
          ))
        }
      </AnimatePresence>
    </motion.div>
  )
}
