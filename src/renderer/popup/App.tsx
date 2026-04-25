import { useState, useEffect, useCallback, useRef } from 'react'
import SearchBar from './components/SearchBar'
import ClipboardList from './components/ClipboardList'
import Footer from './components/Footer'
import type { ClipboardItem } from '../../shared/types'

declare global {
  interface Window {
    api: {
      getHistory: () => Promise<ClipboardItem[]>
      searchHistory: (query: string) => Promise<ClipboardItem[]>
      deleteItem: (id: string) => Promise<ClipboardItem[]>
      pinItem: (id: string) => Promise<ClipboardItem[]>
      pasteItem: (id: string) => Promise<void>
      copyItem: (id: string) => Promise<void>
      clearHistory: (includePinned?: boolean) => Promise<ClipboardItem[]>
      closePopup: () => Promise<void>
      openSettings: () => Promise<void>
      getSettings: () => Promise<Record<string, unknown>>
      onPopupShown: (callback: () => void) => void
      removePopupShownListener: () => void
    }
  }
}

export default function App() {
  const [items, setItems] = useState<ClipboardItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  const loadHistory = useCallback(async () => {
    const history = await window.api.getHistory()
    setItems(history)
  }, [])

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query)
    setSelectedIndex(0)
    if (query.trim()) {
      const results = await window.api.searchHistory(query)
      setItems(results)
    } else {
      loadHistory()
    }
  }, [loadHistory])

  const handlePaste = useCallback(async (id: string) => {
    await window.api.pasteItem(id)
  }, [])

  const handleCopy = useCallback(async (id: string) => {
    await window.api.copyItem(id)
  }, [])

  const handleDelete = useCallback(async (id: string) => {
    const updated = await window.api.deleteItem(id)
    setItems(updated)
  }, [])

  const handlePin = useCallback(async (id: string) => {
    const updated = await window.api.pinItem(id)
    setItems(updated)
  }, [])

  const handleClear = useCallback(async (includePinned: boolean = false) => {
    const updated = await window.api.clearHistory(includePinned)
    setItems(updated)
  }, [])

  const handleOpenSettings = useCallback(async () => {
    await window.api.openSettings()
  }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Escape to close
    if (e.key === 'Escape') {
      window.api.closePopup()
      return
    }

    // Arrow navigation
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, items.length - 1))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
      return
    }

    // Enter to copy, Option+Enter to paste
    if (e.key === 'Enter' && items[selectedIndex]) {
      e.preventDefault()
      if (e.altKey) {
        handlePaste(items[selectedIndex].id)
      } else {
        handleCopy(items[selectedIndex].id)
      }
      return
    }

    // Option+Delete to delete
    if (e.key === 'Backspace' && e.altKey && items[selectedIndex]) {
      e.preventDefault()
      handleDelete(items[selectedIndex].id)
      return
    }

    // Option+P to pin
    if (e.key === 'p' && e.altKey && items[selectedIndex]) {
      e.preventDefault()
      handlePin(items[selectedIndex].id)
      return
    }

    // Cmd+, for settings
    if (e.key === ',' && e.metaKey) {
      e.preventDefault()
      handleOpenSettings()
      return
    }

    // Cmd+1-9 shortcuts
    if (e.metaKey && e.key >= '1' && e.key <= '9') {
      e.preventDefault()
      const index = parseInt(e.key) - 1
      if (items[index]) {
        if (e.altKey) {
          handlePaste(items[index].id)
        } else {
          handleCopy(items[index].id)
        }
      }
      return
    }

    // Option+Cmd+Delete to clear
    if (e.key === 'Backspace' && e.altKey && e.metaKey) {
      e.preventDefault()
      handleClear(e.shiftKey)
      return
    }
  }, [items, selectedIndex, handlePaste, handleCopy, handleDelete, handlePin, handleClear, handleOpenSettings])

  useEffect(() => {
    loadHistory()

    window.api.onPopupShown(() => {
      loadHistory()
      setSearchQuery('')
      setSelectedIndex(0)
    })

    return () => {
      window.api.removePopupShownListener()
    }
  }, [loadHistory])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Auto-scroll selected item into view
  useEffect(() => {
    const listEl = listRef.current
    if (!listEl) return
    const selectedEl = listEl.querySelector(`[data-index="${selectedIndex}"]`)
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [selectedIndex])

  return (
    <div className="popup-container">
      <SearchBar
        value={searchQuery}
        onChange={handleSearch}
      />
      <ClipboardList
        ref={listRef}
        items={items}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
        onCopy={handleCopy}
        onPaste={handlePaste}
        onDelete={handleDelete}
        onPin={handlePin}
      />
      <Footer
        itemCount={items.length}
        onClear={handleClear}
        onOpenSettings={handleOpenSettings}
      />
    </div>
  )
}
