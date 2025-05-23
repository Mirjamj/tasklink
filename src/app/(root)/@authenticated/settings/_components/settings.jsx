'use client'

import { useAuth } from '@/context/authContext'
import React from 'react'
import { SettingsForm } from './settings-form'

export const Settings = () => {

  const { user } = useAuth()

  return <SettingsForm user={user} isOwn />
}
