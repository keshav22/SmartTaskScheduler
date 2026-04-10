'use client'

import { SettingsTabsComponent } from '@/components/setting/tab'
import { SettingsFormComponent } from '@/components/setting/form'
import { useState } from 'react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'focus'>(
    'profile'
  )

  return (
    <div className='pt-6 flex flex-col overflow-hidden'>
        <h1 className="text-2xl font-semibold text-black mb-4 ml-4">
          Settings
        </h1>
        <p className='mb-4 ml-4 text-xs text-gray-500'>
        Manage your account, focus habits, and system integrations.
        </p>
      <div className="flex v-screen overflow-hidden">
        <SettingsTabsComponent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <SettingsFormComponent activeTab={activeTab} />
      </div>

    </div>
  )
}