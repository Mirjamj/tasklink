'use client'

import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where, writeBatch } from "firebase/firestore"
import { useAuth } from "./authContext"
import { format } from "date-fns"
import { db } from "@/lib/firebase"

const { createContext, useContext, useState, useEffect, useMemo } = require("react")
const TasksContext = createContext()

// Provides task-related state and functions to manage tasks for the authenticated user
export const TasksProvider = ({ children }) => {

  // Local state for loading indicator and list of tasks
  const [loading, setLoading] = useState(false)
  const [tasks, setTasks] = useState([])

  // Access auth context to check user and roles
  const { isAdmin, authLoaded, user } = useAuth()

  // Subscribe to Firestore tasks collection on user or auth load changes
  useEffect(() => {
    if (!authLoaded || !user) return
    setLoading(true)
    let q

    // Admins get all tasks, ordered by date and order
    if (user.role === 'admin') {
      q = query(collection(db, 'tasks'), orderBy('date'), orderBy('order'))
    } else {
      // Regular users get only their tasks, filtered by ownerId
      q = query(collection(db, 'tasks'), orderBy('date'), where('ownerId', '==', user.uid), orderBy('order'))
    }

    // Listen for real-time updates from Firestore query
    const unsub = onSnapshot(q, querySnap => {
      const updatedTasks = querySnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setTasks(updatedTasks)
      setLoading(false)
    })

    return () => unsub()
  }, [isAdmin, user])

  // Calculate the next highest order value (for sorting tasks)
  const getNextOrder = () => {
    return Math.max(...tasks.map(task => task.order ?? 0), 0) + 1000
  }

  // Add a new task to Firestore (only admins allowed)
  const addTask = async (taskData) => {

    if (!isAdmin()) return

    setLoading(true)
    try {
      const newTask = {
        ...taskData,
        date: format(taskData.date, 'yyyy-MM-dd'),
        order: getNextOrder(),
        completed: false,
        createdAt: serverTimestamp()
      }

      await addDoc(collection(db, 'tasks'), newTask)
    } catch (error) {
      console.log(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Mark a task as completed by updating Firestore doc
  const completeTask = async (taskId) => {
    setLoading(true)
    try {
      const taskRef = doc(db, 'tasks', taskId)
      await updateDoc(taskRef, {
        completed: true
      })
    } catch (error) {
      console.error('Error trying to update tasks', error)
    } finally {
      setLoading(false)
    }
  }

  // Save reordered task orders in batch for efficient Firestore update
  const saveReorder = async (orderedTasks, moved) => {
    setLoading(true)

    const prevState = tasks
    setTasks(orderedTasks)

    const batch = writeBatch(db)

    // Update each moved task's order in batch
    moved.forEach(({ id, newOrder }) => {
      batch.update(doc(db, 'tasks', id), { order: newOrder })
    })

    try {
      await batch.commit()
    } catch (error) {
      console.error('Batch error:', error)
      setTasks(prevState)
    } finally {
      setLoading(false)
    }
  }

  // Return tasks filtered by user and date, sorted by order
  // Wrapped in useMemo to optimize performance for dependent renders
  const getTasksByUserForDate = (uid, dateObj) => {

    const iso = useMemo(() => format(dateObj, 'yyyy-MM-dd'), [dateObj])
    return useMemo(() => {
      return tasks
        .filter(task => task.ownerId === uid && task.date === iso)
        .sort((a, b) => a.order - b.order)
    }, [tasks, uid, iso])
  }

  // Context value exposing state and action functions
  const value = {
    addTask,
    loading,
    tasks,
    getTasksByUserForDate,
    completeTask,
    saveReorder
  }

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  )
}

// Hook for consuming tasks context with safety check
export const useTasks = () => {
  const context = useContext(TasksContext)
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider')
  }
  return context
}