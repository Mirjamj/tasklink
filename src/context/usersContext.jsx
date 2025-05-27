'use client'

import { collection, onSnapshot, query } from "firebase/firestore"
import { useAuth } from "./authContext"
import { db } from "@/lib/firebase"

const { createContext, useContext, useEffect, useState } = require("react")
const UsersContext = createContext()

// Provides user data and loading state to components, only for admin users
export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  const { isAdmin } = useAuth()

  // Subscribe to Firestore 'users' collection updates if current user is admin
  useEffect(() => {
    if (!isAdmin()) return

    const q = query(collection(db, 'users'))
    const unsub = onSnapshot(q, querySnapshot => {
      const usersData = []

      // Collect users data from snapshot documents
      querySnapshot.forEach(doc => {
        usersData.push({ ...doc.data(), id: doc.id })
      })
      setUsers(usersData)
    })

    return () => unsub()
  }, [isAdmin])

  // Context value exposes users list and loading state
  const value = {
    users,
    loading
  }

  return (
    <UsersContext.Provider value={value}>
      {children}
    </UsersContext.Provider>
  )
}

// Hook to consume UsersContext safely
export const useUsers = () => {
  const context = useContext(UsersContext)
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider')
  }
  return context
}