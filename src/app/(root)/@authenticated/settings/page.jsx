import { Settings } from './_components/settings'
import React from 'react'

function SettingsPage() {
  return (
    <div className='py-5'>
      <div className="mb-10">
        <p className='font-semibold text-2xl text-center'>Profile settings</p>
      </div>
      <Settings />
    </div>
  )
}

export default SettingsPage