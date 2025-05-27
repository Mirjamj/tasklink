'use client'

import { auth, db } from '@/lib/firebase'
import { createUserWithEmailAndPassword, EmailAuthProvider, onAuthStateChanged, reauthenticateWithCredential, signInWithEmailAndPassword, signOut, updatePassword, updateProfile } from 'firebase/auth'
import { doc, getDoc, setDoc, Timestamp, updateDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const { createContext, useContext, useState, useEffect } = require('react')
const AuthContext = createContext()

// Provides authentication context for the app: user state, auth status, and related methods
export const AuthProvider = ({ children }) => {
  // State to hold current user object, loading status, and whether auth state has loaded
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [authLoaded, setAuthLoaded] = useState(false)

  const router = useRouter()

  // Subscribe to Firebase auth state changes on component mount
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null)
        setAuthLoaded(true)
        return
      }

      const docRef = doc(db, 'users', firebaseUser.uid)

      // Retry fetching user document up to 5 times with delay, in case of eventual consistency delays
      const getUserDocWithRetry = async (retries = 5, delay = 300) => {
        let docSnap = null
        for (let i = 0; i < retries; i++) {
          docSnap = await getDoc(docRef)
          if (docSnap.exists()) break
          await new Promise(resolve => setTimeout(resolve, delay))
        }
        return docSnap
      }

      const docSnap = await getUserDocWithRetry()

      if (docSnap && docSnap.exists()) {
        setUser(docSnap.data())
      } else {
        console.warn('User document not available')
        setUser(null)
      }

      setAuthLoaded(true)

    })
    return () => unsub()
  }, [])

  // Register new user with email, password, and displayName
  const register = async (email, password, displayName) => {
    setLoading(true)

    try {
      console.log('registring:', email, password)
      const res = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(res.user, { displayName })

      if (!res.user) {
        console.log('no user')
        return
      }

      // Create user document in Firestore with default role and profile settings
      await setDoc(doc(db, 'users', res.user.uid), {
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName,
        role: 'user',
        createdAt: Timestamp.now(),
        verified: false,
      })

    } catch (error) {
      console.log('Error registering the user:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Log out the current user and redirect to home page
  const logout = async () => {
    router.replace('/')
    await signOut(auth)
  }

  // Log in existing user with email and password
  const login = async (email, password) => {
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.log('Could not sign in:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Helper function to check if current user has admin role
  const isAdmin = () => {
    if (!user) return false
    return user.role === 'admin'
  }

  // Update user profile data in Firestore and local state
  const updateUser = async (user, newUserData) => {
    setLoading(true)
    const toastId = toast.loading('Loading...')
    try {
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, newUserData)
      setUser((prevUser) => ({ ...prevUser, ...newUserData }))
      toast.success('Profile updated', { id: toastId })
    } catch (error) {
      toast.error('Oops! Something went wrong, please try again later.', { id: toastId })
      console.error('Error updating the user:', error)
    } finally {
      setLoading(false)
    }
  }

  // Change the current user's password after re-authenticating with old password
  const changePassword = async (oldPassword, newPassword) => {
    setLoading(true)
    const toastId = toast.loading('Loading...')
    const user = auth.currentUser

    if (!user) {
      console.error('No user is currently logged in')
      toast.error('No user is currently logged in', { id: toastId })
      return
    }

    try {
      const userCredential = await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, oldPassword))
      await updatePassword(userCredential.user, newPassword)
      toast.success('Your passsword has been changed!', { id: toastId })
    } catch (error) {
      console.error('Error reautchenticating user:', error)
      if (error.code === 'auth/invalid-credential') {
        toast.error('Incorrect password', { id: toastId })
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password must contain at least 6 characters', { id: toastId })
      } else {
        toast.error('Oops! Something went wrong, please try again later.', { id: toastId })
      }
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Context value to be provided to consuming components
  const value = {
    user,
    loading,
    authLoaded,
    register,
    logout,
    login,
    isAdmin,
    updateUser,
    changePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to access authentication context, throws error if used outside provider
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
