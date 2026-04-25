import { useState } from 'react'
import { SparklesIcon, CheckCircleIcon, PartyIcon } from '../../shared/Icons'
import type { AppSettings } from '../../../shared/types'

interface AICleanTabProps {
  settings: AppSettings
  onUpdate: (partial: Partial<AppSettings>) => void
}

export default function AICleanTab({ settings, onUpdate }: AICleanTabProps) {
  const [testInput, setTestInput] = useState('')
  const [testResult, setTestResult] = useState<{
    cleanedText: string
    charsRemoved: number
    removedChars: Array<{ name: string; count: number; codePoint: string }>
  } | null>(null)

  const handleTestClean = async () => {
    if (!testInput.trim()) return
    const result = await window.api.cleanText(testInput)
    setTestResult(result)
  }

  return (
    <div className="tab-content">
      <h2 className="tab-title">
        AutomaticClean
        <span className="title-badge"><SparklesIcon size={12} /> Signature Feature</span>
      </h2>
      <p className="tab-description">
        Automatically remove invisible Unicode characters that Automatictools insert in copied text.
        These hidden characters can cause issues with code, formatting, and search.
      </p>

      <div className="settings-section">
        <h3 className="section-title">Cleaning Mode</h3>

        <div className="setting-row highlighted">
          <div className="setting-info">
            <label className="setting-label">Auto-clean on copy</label>
            <span className="setting-hint">Automatically clean every text you copy</span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.cleanOnCopy}
              onChange={(e) => onUpdate({ cleanOnCopy: e.target.checked })}
            />
            <span className="toggle-slider accent" />
          </label>
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <label className="setting-label">Show cleaning badge</label>
            <span className="setting-hint">Display cleaning badge on items that were cleaned</span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.showCleaningBadge}
              onChange={(e) => onUpdate({ showCleaningBadge: e.target.checked })}
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="section-title">Characters to Remove</h3>

        <div className="setting-row">
          <div className="setting-info">
            <label className="setting-label">Zero-width characters</label>
            <span className="setting-hint">U+200B, U+200C, U+200D, U+FEFF, U+2060, U+034F</span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.removeZeroWidth}
              onChange={(e) => onUpdate({ removeZeroWidth: e.target.checked })}
            />
            <span className="toggle-slider" />
          </label>
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <label className="setting-label">Soft hyphens</label>
            <span className="setting-hint">U+00AD — invisible line-break hints</span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.removeSoftHyphens}
              onChange={(e) => onUpdate({ removeSoftHyphens: e.target.checked })}
            />
            <span className="toggle-slider" />
          </label>
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <label className="setting-label">Directional marks</label>
            <span className="setting-hint">LTR/RTL marks, embeddings, overrides, isolates</span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.removeDirectionalMarks}
              onChange={(e) => onUpdate({ removeDirectionalMarks: e.target.checked })}
            />
            <span className="toggle-slider" />
          </label>
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <label className="setting-label">Invisible math operators</label>
            <span className="setting-hint">U+2061–U+2064 — invisible function/times/separator/plus</span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.removeInvisibleMath}
              onChange={(e) => onUpdate({ removeInvisibleMath: e.target.checked })}
            />
            <span className="toggle-slider" />
          </label>
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <label className="setting-label">Non-breaking spaces → regular spaces</label>
            <span className="setting-hint">U+00A0 — convert to normal space characters</span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.normalizeNonBreakingSpaces}
              onChange={(e) => onUpdate({ normalizeNonBreakingSpaces: e.target.checked })}
            />
            <span className="toggle-slider" />
          </label>
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <label className="setting-label">Normalize smart quotes</label>
            <span className="setting-hint">Convert curly quotes "" '' to straight quotes</span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.normalizeSmartQuotes}
              onChange={(e) => onUpdate({ normalizeSmartQuotes: e.target.checked })}
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="section-title">Safety</h3>

        <div className="setting-row">
          <div className="setting-info">
            <label className="setting-label">Preserve emoji sequences</label>
            <span className="setting-hint">Keep ZWJ characters used in compound emojis (👨‍👩‍👧‍👦)</span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.preserveEmojiZWJ}
              onChange={(e) => onUpdate({ preserveEmojiZWJ: e.target.checked })}
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="section-title">Test Cleaning</h3>
        <p className="section-description">
          Paste any text below to see what invisible characters would be removed.
        </p>

        <div className="test-area">
          <textarea
            className="test-input"
            placeholder="Paste text here to test cleaning..."
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            rows={3}
          />
          <button className="test-button" onClick={handleTestClean}>
            <SparklesIcon size={14} color="white" /> Clean Text
          </button>

          {testResult && (
            <div className="test-result">
              {testResult.charsRemoved > 0 ? (
                <>
                  <div className="result-header success">
                    <span className="result-icon"><CheckCircleIcon size={18} color="#34d399" /></span>
                    <span>Found and removed <strong>{testResult.charsRemoved}</strong> invisible character{testResult.charsRemoved > 1 ? 's' : ''}!</span>
                  </div>
                  <div className="result-details">
                    {testResult.removedChars.map((rc, i) => (
                      <div key={i} className="result-char">
                        <span className="char-name">{rc.name}</span>
                        <span className="char-code">{rc.codePoint}</span>
                        <span className="char-count">×{rc.count}</span>
                      </div>
                    ))}
                  </div>
                  <div className="result-cleaned">
                    <label>Cleaned text:</label>
                    <div className="cleaned-text">{testResult.cleanedText}</div>
                  </div>
                </>
              ) : (
                <div className="result-header clean">
                  <span className="result-icon"><PartyIcon size={18} color="#38bdf8" /></span>
                  <span>Text is clean! No invisible characters found.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
