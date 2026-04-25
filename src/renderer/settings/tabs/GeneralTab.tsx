import type { AppSettings } from '../../../shared/types'

interface GeneralTabProps {
  settings: AppSettings
  onUpdate: (partial: Partial<AppSettings>) => void
}

export default function GeneralTab({ settings, onUpdate }: GeneralTabProps) {
  return (
    <div className="tab-content">
      <h2 className="tab-title">General</h2>
      <p className="tab-description">Configure how ClearPaste works</p>

      <div className="settings-section">
        <h3 className="section-title">Startup</h3>

        <div className="setting-row">
          <div className="setting-info">
            <label className="setting-label">Launch at login</label>
            <span className="setting-hint">Automatically start ClearPaste when you log in</span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.launchAtLogin}
              onChange={(e) => onUpdate({ launchAtLogin: e.target.checked })}
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="section-title">Clipboard</h3>

        <div className="setting-row">
          <div className="setting-info">
            <label className="setting-label">Check interval</label>
            <span className="setting-hint">How often to check for new clipboard content</span>
          </div>
          <div className="setting-control">
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={settings.clipboardCheckInterval}
              onChange={(e) => onUpdate({ clipboardCheckInterval: parseInt(e.target.value) })}
              className="range-input"
            />
            <span className="range-value">{settings.clipboardCheckInterval}ms</span>
          </div>
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <label className="setting-label">History size</label>
            <span className="setting-hint">Maximum number of items to keep</span>
          </div>
          <div className="setting-control">
            <input
              type="number"
              min="10"
              max="999"
              value={settings.maxHistorySize}
              onChange={(e) => onUpdate({ maxHistorySize: parseInt(e.target.value) || 200 })}
              className="number-input"
            />
          </div>
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <label className="setting-label">Paste automatically</label>
            <span className="setting-hint">Paste after selecting an item from history</span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.pasteAutomatically}
              onChange={(e) => onUpdate({ pasteAutomatically: e.target.checked })}
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="section-title">Keyboard Shortcut</h3>

        <div className="setting-row">
          <div className="setting-info">
            <label className="setting-label">Open ClearPaste</label>
            <span className="setting-hint">Global shortcut to open the clipboard popup</span>
          </div>
          <div className="hotkey-display">
            {settings.hotkey.replace('Shift+CommandOrControl+', '⇧⌘')}
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="section-title">Sound</h3>

        <div className="setting-row">
          <div className="setting-info">
            <label className="setting-label">Sound effects</label>
            <span className="setting-hint">Play sounds for copy and paste actions</span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.soundEffects}
              onChange={(e) => onUpdate({ soundEffects: e.target.checked })}
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>
    </div>
  )
}
