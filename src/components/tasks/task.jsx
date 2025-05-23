'use client'

import React, { useEffect, useState } from 'react'
import Lottie from 'lottie-react'
import successAnimation from '/success-animation.json'

export const Task = ({ task, handleComplete, index }) => {
  const [showSuccess, setShowSuccess] = useState(false)

  const onComplete = () => {
    setShowSuccess(true)
    setTimeout(() => {
      handleComplete(task)
    }, 2000)
  }

  if (showSuccess) {
    return (
      <div className='p-4 flex justify-center items-center bg-background rounded'>
        <Lottie animationData={successAnimation} loop={false} style={{ width: 50, height: 50 }} />
      </div>
    )
  }

  return (
    <div
      className="p-4 shadow-sm bg-blue-400/20 rounded cursor-pointer"
      onClick={onComplete}
    >
      <span>{task.title}</span>
    </div>
  )
}

export const Delay = ({ children, delay }) => {

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  if (!visible) return null

  return <>{children}</>
}
