import { clipboard } from 'electron'
import { v4 as uuidv4 } from 'uuid'
import { cleanText, hasInvisibleChars } from './text-cleaner'
import { addHistoryItem, getSettings, addCleaningStats } from './store'
import type { ClipboardItem } from '../shared/types'

let monitorInterval: ReturnType<typeof setInterval> | null = null
let lastClipboardContent = ''
let isIgnoring = false
let ignoreNextCopy = false

export function startMonitoring(): void {
  const settings = getSettings()
  const interval = settings.clipboardCheckInterval || 500

  // Initialize with current clipboard content
  lastClipboardContent = clipboard.readText() || ''

  monitorInterval = setInterval(() => {
    if (isIgnoring) return
    if (ignoreNextCopy) {
      ignoreNextCopy = false
      lastClipboardContent = clipboard.readText() || ''
      return
    }

    checkClipboard()
  }, interval)
}

export function stopMonitoring(): void {
  if (monitorInterval) {
    clearInterval(monitorInterval)
    monitorInterval = null
  }
}

export function restartMonitoring(): void {
  stopMonitoring()
  startMonitoring()
}

export function toggleIgnoreMode(): void {
  isIgnoring = !isIgnoring
}

export function setIgnoreNextCopy(): void {
  ignoreNextCopy = true
}

export function getIgnoreMode(): boolean {
  return isIgnoring
}

function checkClipboard(): void {
  const currentText = clipboard.readText()

  if (!currentText || currentText === lastClipboardContent) return

  console.log('[ClearPaste] New clipboard content detected, length:', currentText.length)

  lastClipboardContent = currentText

  const settings = getSettings()

  let finalContent = currentText
  let isCleaned = false
  let charsRemoved = 0
  let originalContent: string | undefined

  const hasInvisible = hasInvisibleChars(currentText)
  console.log('[ClearPaste] cleanOnCopy:', settings.cleanOnCopy, '| hasInvisibleChars:', hasInvisible)

  // Automaticcleaning
  if (settings.cleanOnCopy && hasInvisible) {
    const result = cleanText(currentText, settings)
    console.log('[ClearPaste] Cleaning result:', result.charsRemoved, 'chars removed')
    if (result.removedChars.length > 0) {
      console.log('[ClearPaste] Removed:', result.removedChars.map(r => `${r.name} x${r.count}`).join(', '))
    }
    if (result.charsRemoved > 0) {
      finalContent = result.cleanedText
      isCleaned = true
      charsRemoved = result.charsRemoved
      originalContent = currentText

      // Update the system clipboard with cleaned text
      clipboard.writeText(finalContent)
      lastClipboardContent = finalContent

      // Update stats
      addCleaningStats(charsRemoved)
      console.log('[ClearPaste] ✨ Clipboard cleaned! Wrote clean text back to clipboard')
    }
  }

  const item: ClipboardItem = {
    id: uuidv4(),
    content: finalContent,
    originalContent: originalContent,
    type: 'text',
    timestamp: Date.now(),
    isPinned: false,
    isCleaned,
    charsRemoved
  }

  addHistoryItem(item)
}
