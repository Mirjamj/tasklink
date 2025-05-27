'use client'

import React, { useEffect, useState } from 'react'
import Lottie from 'lottie-react'
import successAnimation from '/success-animation.json'

export const Task = ({ task, handleComplete, index }) => {
  // State to toggle the success animation on task completion
  const [showSuccess, setShowSuccess] = useState(false)

  // Called when the user clicks to complete the task
  const onComplete = () => {
    setShowSuccess(true) // Show success animation
    setTimeout(() => {
      handleComplete(task) // Call parent handler after 2 seconds delay
    }, 2000)
  }

  // Show success animation while visible
  if (showSuccess) {
    return (
      <div className='p-4 flex justify-center items-center bg-background rounded'>
        <Lottie animationData={successAnimation} loop={false} style={{ width: 50, height: 50 }} />
      </div>
    )
  }

  // Default task display with click to complete
  return (
    <div
      className="p-4 shadow-sm bg-blue-400/20 rounded cursor-pointer"
      onClick={onComplete}
    >
      <span>{task.title}</span>
    </div>
  )
}

// Component to delay rendering of children by specified milliseconds
export const Delay = ({ children, delay }) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer) // Cleanup timer on unmount
  }, [delay])

  if (!visible) return null

  return <>{children}</>
}
