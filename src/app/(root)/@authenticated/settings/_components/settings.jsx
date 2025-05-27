'use client'

import { useAuth } from '@/context/authContext'
import React from 'react'
import { SettingsForm } from './settings-form'

// Settings component for rendering the current user's settings page.
// Passes the authenticated user to SettingsForm and marks the form as "own" (editable by the user).
export const Settings = () => {

  const { user } = useAuth()

  return <SettingsForm user={user} isOwn />
}
