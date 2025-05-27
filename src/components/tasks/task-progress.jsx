import { cn } from '@/lib/utils'
import React from 'react'
import { Progress } from '../ui/progress'

export const TaskProgress = ({ total = 0, completed = 0, className, user }) => {

  // Calculate the completion percentage (avoid NaN by checking total)
  const progress = (completed / total) * 100
  return (
    <div className={cn('', className)}>
      {/* Display user's name */}
      <div>
        <h2>{user.displayName}</h2>
      </div>
      {/* Show completed tasks count and progress percentage */}
      <div className='flex items-center justify-between mb-2'>
        <span>{completed} / {total}</span>
        <span>{isNaN(progress.toFixed(0)) ? 0 : progress.toFixed(0)}%</span>
      </div>
      {/* Visual progress bar indicating completion */}
      <Progress
        value={progress}
        className='h-4'
      />
    </div>
  )
}
