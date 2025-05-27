import React from 'react'
import { ThemeProvider } from './theme-provider'
import { AuthProvider } from '@/context/authContext'
import { UsersProvider } from '@/context/usersContext'
import { TasksProvider } from '@/context/tasksContext'

// Combines and nests all global context providers (auth, users, tasks, and theme) to wrap the app.
function Providers({ children }) {
  return (
    <AuthProvider>
      <UsersProvider>
        <TasksProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </TasksProvider>
      </UsersProvider>
    </AuthProvider>
  )
}

export default Providers