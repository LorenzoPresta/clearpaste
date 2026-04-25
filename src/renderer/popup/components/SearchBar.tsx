import { useState, useEffect, useRef } from 'react'

interface SearchBarProps {
  value: string
  onChange: (query: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    // Auto-focus on mount and when popup is shown
    inputRef.current?.focus()

    const handlePopupShown = () => {
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }, 50)
    }

    window.api.onPopupShown(handlePopupShown)
  }, [])

  return (
    <div className={`search-bar ${isFocused ? 'focused' : ''}`}>
      <div className="search-icon">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
      </div>
      <input
        ref={inputRef}
        type="text"
        className="search-input"
        placeholder="Search clipboard…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
      />
      {!value && !isFocused && (
        <span className="search-shortcut-hint">⇧⌘V</span>
      )}
      {value && (
        <button
          className="search-clear"
          onClick={() => onChange('')}
          tabIndex={-1}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>
      )}
    </div>
  )
}
