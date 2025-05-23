'use client'

import { collection, doc, onSnapshot, query } from "firebase/firestore"
import { useAuth } from "./authContext"
import { db } from "@/lib/firebase"

const { createContext, useContext, useEffect, useState } = require("react")

const UsersContext = createContext()

export const UsersProvider = ({ children }) => {

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)


  const { isAdmin } = useAuth()

  useEffect(() => {
    if (!isAdmin()) return

    const q = query(collection(db, 'users'))
    const unsub = onSnapshot(q, querySnapshot => {
      const usersData = []

      querySnapshot.forEach(doc => {
        usersData.push({ ...doc.data(), id: doc.id })
      })
      setUsers(usersData)
    })

    return () => unsub()
  }, [isAdmin])

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

export const useUsers = () => {
  const context = useContext(UsersContext)
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider')
  }
  return context
}