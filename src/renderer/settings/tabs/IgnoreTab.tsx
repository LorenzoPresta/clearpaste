import { useState } from 'react'
import type { AppSettings } from '../../../shared/types'

interface IgnoreTabProps {
  settings: AppSettings
  onUpdate: (partial: Partial<AppSettings>) => void
}

export default function IgnoreTab({ settings, onUpdate }: IgnoreTabProps) {
  const [newApp, setNewApp] = useState('')
  const [newType, setNewType] = useState('')

  const addIgnoredApp = () => {
    if (!newApp.trim()) return
    const updated = [...settings.ignoredApps, newApp.trim()]
    onUpdate({ ignoredApps: updated })
    setNewApp('')
  }

  const removeIgnoredApp = (app: string) => {
    const updated = settings.ignoredApps.filter(a => a !== app)
    onUpdate({ ignoredApps: updated })
  }

  const addIgnoredType = () => {
    if (!newType.trim()) return
    const updated = [...settings.ignoredPasteTypes, newType.trim()]
    onUpdate({ ignoredPasteTypes: updated })
    setNewType('')
  }

  const removeIgnoredType = (type: string) => {
    const updated = settings.ignoredPasteTypes.filter(t => t !== type)
    onUpdate({ ignoredPasteTypes: updated })
  }

  return (
    <div className="tab-content">
      <h2 className="tab-title">Ignore</h2>
      <p className="tab-description">Configure which apps and paste types to ignore</p>

      <div className="settings-section">
        <h3 className="section-title">Ignored Applications</h3>
        <p className="section-description">
          Clipboard copies from these applications won't be saved to history.
        </p>

        <div className="list-input-row">
          <input
            type="text"
            className="text-input"
            placeholder="Application name..."
            value={newApp}
            onChange={(e) => setNewApp(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addIgnoredApp()}
          />
          <button className="add-button" onClick={addIgnoredApp}>Add</button>
        </div>

        <div className="tag-list">
          {settings.ignoredApps.length === 0 && (
            <span className="no-items">No ignored applications</span>
          )}
          {settings.ignoredApps.map(app => (
            <div key={app} className="tag">
              <span>{app}</span>
              <button className="tag-remove" onClick={() => removeIgnoredApp(app)}>×</button>
            </div>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h3 className="section-title">Ignored Pasteboard Types</h3>
        <p className="section-description">
          Clipboard entries with these types will be ignored. Use Pasteboard Viewer to find custom types.
        </p>

        <div className="list-input-row">
          <input
            type="text"
            className="text-input"
            placeholder="e.g., com.app.custom.type"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addIgnoredType()}
          />
          <button className="add-button" onClick={addIgnoredType}>Add</button>
        </div>

        <div className="tag-list">
          {settings.ignoredPasteTypes.map(type => (
            <div key={type} className="tag">
              <span className="tag-text">{type}</span>
              <button className="tag-remove" onClick={() => removeIgnoredType(type)}>×</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
