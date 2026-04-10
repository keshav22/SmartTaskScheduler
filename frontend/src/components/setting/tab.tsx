'use client'

import './setting.css'

type TabType = 'profile'

interface SettingsTabsComponentProps {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
}

export function SettingsTabsComponent({
  activeTab,
  setActiveTab,
}: SettingsTabsComponentProps) {
  const tabs: { label: string; value: TabType }[] = [
    { label: 'Profile details', value: 'profile' },
  ]

  return (
    <div className="tabs-wrapper">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`button ${activeTab === tab.value ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}