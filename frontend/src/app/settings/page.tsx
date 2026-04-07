'use client'

import { SettingsTabsComponent } from '@/components/setting/tab'
import { SettingsFormComponent } from '@/components/setting/form'
import { useState } from 'react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'focus'>(
    'profile'
  )

  return (
    <div className='pt-6'>
        <h1 className="text-2xl font-semibold text-black mb-4 ml-4">
          Settings
        </h1>
      <div className="flex v-screen">
        <SettingsTabsComponent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <SettingsFormComponent activeTab={activeTab} />
      </div>

    </div>
  )
}