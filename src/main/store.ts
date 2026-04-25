import Store from 'electron-store'
import type { ClipboardItem, AppSettings } from '../shared/types'
import { DEFAULT_SETTINGS } from '../shared/types'

interface StoreSchema {
  history: ClipboardItem[]
  settings: AppSettings
  stats: {
    totalCharsRemoved: number
    totalItemsCleaned: number
  }
}

const store = new Store<StoreSchema>({
  name: 'clearpaste-data',
  defaults: {
    history: [],
    settings: DEFAULT_SETTINGS,
    stats: {
      totalCharsRemoved: 0,
      totalItemsCleaned: 0
    }
  }
})

// --- History ---

export function getHistory(): ClipboardItem[] {
  return store.get('history', [])
}

export function addHistoryItem(item: ClipboardItem): void {
  const history = getHistory()
  const settings = getSettings()

  // Check for duplicate content (skip if same text already exists as most recent non-pinned)
  const existingIndex = history.findIndex(h => h.content === item.content && !h.isPinned)
  if (existingIndex !== -1) {
    // Move to top by removing the old one
    history.splice(existingIndex, 1)
  }

  // Add to beginning (after pinned items)
  const firstUnpinnedIndex = history.findIndex(h => !h.isPinned)
  if (firstUnpinnedIndex === -1) {
    history.push(item)
  } else {
    history.splice(firstUnpinnedIndex, 0, item)
  }

  // Trim to max size (but keep pinned)
  const pinned = history.filter(h => h.isPinned)
  const unpinned = history.filter(h => !h.isPinned)
  const trimmedUnpinned = unpinned.slice(0, settings.maxHistorySize - pinned.length)

  store.set('history', [...pinned, ...trimmedUnpinned])
}

export function deleteHistoryItem(id: string): void {
  const history = getHistory().filter(item => item.id !== id)
  store.set('history', history)
}

export function pinHistoryItem(id: string): void {
  const history = getHistory()
  const item = history.find(h => h.id === id)
  if (!item) return

  item.isPinned = !item.isPinned
  if (item.isPinned) {
    item.pinOrder = Date.now()
  } else {
    delete item.pinOrder
  }

  // Re-sort: pinned first (by pinOrder), then unpinned (by timestamp desc)
  const pinned = history.filter(h => h.isPinned).sort((a, b) => (a.pinOrder || 0) - (b.pinOrder || 0))
  const unpinned = history.filter(h => !h.isPinned).sort((a, b) => b.timestamp - a.timestamp)

  store.set('history', [...pinned, ...unpinned])
}

export function clearHistory(includePinned: boolean = false): void {
  if (includePinned) {
    store.set('history', [])
  } else {
    const pinned = getHistory().filter(h => h.isPinned)
    store.set('history', pinned)
  }
}

export function searchHistory(query: string): ClipboardItem[] {
  const history = getHistory()
  if (!query.trim()) return history

  const lowerQuery = query.toLowerCase()
  return history.filter(item =>
    item.content.toLowerCase().includes(lowerQuery)
  )
}

// --- Settings ---

export function getSettings(): AppSettings {
  return store.get('settings', DEFAULT_SETTINGS)
}

export function updateSettings(partial: Partial<AppSettings>): AppSettings {
  const current = getSettings()
  const updated = { ...current, ...partial }
  store.set('settings', updated)
  return updated
}

// --- Stats ---

export function getStats() {
  return store.get('stats', { totalCharsRemoved: 0, totalItemsCleaned: 0 })
}

export function addCleaningStats(charsRemoved: number): void {
  const stats = getStats()
  stats.totalCharsRemoved += charsRemoved
  stats.totalItemsCleaned += 1
  store.set('stats', stats)
}
