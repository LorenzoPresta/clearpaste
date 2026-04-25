import { useState, useEffect, useCallback } from 'react'
import GeneralTab from './tabs/GeneralTab'
import AppearanceTab from './tabs/AppearanceTab'
import AICleanTab from './tabs/AICleanTab'
import IgnoreTab from './tabs/IgnoreTab'
import { SettingsIcon, PaletteIcon, SparklesIcon, BanIcon, LogoIcon } from '../shared/Icons'
import type { AppSettings } from '../../shared/types'
import type { ReactNode } from 'react'

declare global {
  interface Window {
    api: {
      getSettings: () => Promise<AppSettings>
      updateSettings: (partial: Partial<AppSettings>) => Promise<AppSettings>
      getStats: () => Promise<{ totalCharsRemoved: number; totalItemsCleaned: number }>
      cleanText: (text: string) => Promise<{
        cleanedText: string
        originalText: string
        charsRemoved: number
        removedChars: Array<{ char: string; name: string; count: number; codePoint: string }>
      }>
      getVersion: () => Promise<string>
    }
  }
}

type TabId = 'general' | 'appearance' | 'aiclean' | 'ignore'

const TABS: { id: TabId; label: string; icon: ReactNode }[] = [
  { id: 'general', label: 'General', icon: <SettingsIcon size={16} /> },
  { id: 'appearance', label: 'Appearance', icon: <PaletteIcon size={16} /> },
  { id: 'aiclean', label: 'AutomaticClean', icon: <SparklesIcon size={16} /> },
  { id: 'ignore', label: 'Ignore', icon: <BanIcon size={16} /> }
]

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('general')
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [stats, setStats] = useState({ totalCharsRemoved: 0, totalItemsCleaned: 0 })
  const [appVersion, setAppVersion] = useState<string>('')

  useEffect(() => {
    loadSettings()
    loadStats()
    loadVersion()
  }, [])

  const loadSettings = async () => {
    const s = await window.api.getSettings()
    setSettings(s)
  }

  const loadStats = async () => {
    const st = await window.api.getStats()
    setStats(st)
  }

  const loadVersion = async () => {
    const version = await window.api.getVersion()
    setAppVersion(version)
  }

  const handleUpdateSettings = useCallback(async (partial: Partial<AppSettings>) => {
    const updated = await window.api.updateSettings(partial)
    setSettings(updated)
  }, [])

  if (!settings) {
    return <div className="settings-loading">Loading...</div>
  }

  return (
    <div className="settings-container">
      {/* Draggable title bar area */}
      <div className="titlebar-drag-region" />

      <div className="settings-layout">
        {/* Sidebar */}
        <nav className="settings-sidebar">
          <div className="sidebar-header">
            <div className="app-icon"><LogoIcon size={28} /></div>
            <span className="app-name">ClearPaste</span>
          </div>
          <div className="sidebar-tabs">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
                {tab.id === 'aiclean' && (
                  <span className="tab-badge">NEW</span>
                )}
              </button>
            ))}
          </div>

          <div className="sidebar-footer">
            <div className="stats-card">
              <div className="stat-value">{stats.totalCharsRemoved.toLocaleString()}</div>
              <div className="stat-label">invisible chars removed</div>
            </div>
            {appVersion && (
              <div className="app-version">Version {appVersion}</div>
            )}
          </div>
        </nav>

        {/* Content */}
        <main className="settings-content">
          {activeTab === 'general' && (
            <GeneralTab settings={settings} onUpdate={handleUpdateSettings} />
          )}
          {activeTab === 'appearance' && (
            <AppearanceTab settings={settings} onUpdate={handleUpdateSettings} />
          )}
          {activeTab === 'aiclean' && (
            <AICleanTab settings={settings} onUpdate={handleUpdateSettings} />
          )}
          {activeTab === 'ignore' && (
            <IgnoreTab settings={settings} onUpdate={handleUpdateSettings} />
          )}
        </main>
      </div>
    </div>
  )
}
