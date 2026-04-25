import type { AppSettings } from '../../../shared/types'

interface AppearanceTabProps {
  settings: AppSettings
  onUpdate: (partial: Partial<AppSettings>) => void
}

export default function AppearanceTab({ settings, onUpdate }: AppearanceTabProps) {
  return (
    <div className="tab-content">
      <h2 className="tab-title">Appearance</h2>
      <p className="tab-description">Customize how ClearPaste looks</p>

      <div className="settings-section">
        <h3 className="section-title">Popup</h3>

        <div className="setting-row">
          <div className="setting-info">
            <label className="setting-label">Popup position</label>
            <span className="setting-hint">Where the clipboard popup appears</span>
          </div>
          <div className="select-wrapper">
            <select
              value={settings.popupPosition}
              onChange={(e) => onUpdate({ popupPosition: e.target.value as 'tray' | 'center' | 'cursor' })}
              className="select-input"
            >
              <option value="tray">Near menu bar</option>
              <option value="center">Screen center</option>
              <option value="cursor">At cursor</option>
            </select>
          </div>
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <label className="setting-label">Show footer</label>
            <span className="setting-hint">Show the bottom bar with item count and actions</span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.showFooter}
              onChange={(e) => onUpdate({ showFooter: e.target.checked })}
            />
            <span className="toggle-slider" />
          </label>
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <label className="setting-label">Show item count in menu bar</label>
            <span className="setting-hint">Display the number of clipboard items next to the tray icon</span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.showItemCount}
              onChange={(e) => onUpdate({ showItemCount: e.target.checked })}
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="section-title">Theme</h3>

        <div className="theme-selector">
          {(['system', 'dark', 'light'] as const).map(theme => (
            <button
              key={theme}
              className={`theme-option ${settings.theme === theme ? 'active' : ''}`}
              onClick={() => onUpdate({ theme })}
            >
              <div className={`theme-preview theme-preview-${theme}`}>
                <div className="preview-bar" />
                <div className="preview-line" />
                <div className="preview-line short" />
              </div>
              <span className="theme-name">{theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
