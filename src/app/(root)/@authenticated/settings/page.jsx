import { Settings } from './_components/settings'
import React from 'react'

// SettingsPage component - displays the user's profile settings page
function SettingsPage() {
  return (
    <div className='py-5'>
      <div className="mb-10">
        <p className='font-semibold text-2xl text-center'>Profile settings</p>
      </div>

      {/* Renders the main settings form (username, password, etc.) */}
      <Settings />
    </div>
  )
}

export default SettingsPage