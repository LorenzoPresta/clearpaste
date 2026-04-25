import { contextBridge, ipcRenderer } from 'electron'
import type { ClipboardItem, AppSettings, CleaningResult } from '../shared/types'

const api = {
  // Clipboard operations
  getHistory: (): Promise<ClipboardItem[]> =>
    ipcRenderer.invoke('clipboard:get-history'),

  searchHistory: (query: string): Promise<ClipboardItem[]> =>
    ipcRenderer.invoke('clipboard:search', query),

  deleteItem: (id: string): Promise<ClipboardItem[]> =>
    ipcRenderer.invoke('clipboard:delete-item', id),

  pinItem: (id: string): Promise<ClipboardItem[]> =>
    ipcRenderer.invoke('clipboard:pin-item', id),

  pasteItem: (id: string): Promise<void> =>
    ipcRenderer.invoke('clipboard:paste-item', id),

  copyItem: (id: string): Promise<void> =>
    ipcRenderer.invoke('clipboard:copy-item', id),

  clearHistory: (includePinned: boolean = false): Promise<ClipboardItem[]> =>
    ipcRenderer.invoke('clipboard:clear-history', includePinned),

  cleanText: (text: string): Promise<CleaningResult> =>
    ipcRenderer.invoke('clipboard:clean-text', text),

  // Settings
  getSettings: (): Promise<AppSettings> =>
    ipcRenderer.invoke('settings:get'),

  updateSettings: (partial: Partial<AppSettings>): Promise<AppSettings> =>
    ipcRenderer.invoke('settings:update', partial),

  // Window
  closePopup: (): Promise<void> =>
    ipcRenderer.invoke('window:close-popup'),

  openSettings: (): Promise<void> =>
    ipcRenderer.invoke('window:open-settings'),

  // Stats
  getStats: (): Promise<{ totalCharsRemoved: number; totalItemsCleaned: number }> =>
    ipcRenderer.invoke('app:get-stats'),

  // App details
  getVersion: (): Promise<string> =>
    ipcRenderer.invoke('app:get-version'),

  // Events
  onPopupShown: (callback: () => void): void => {
    ipcRenderer.on('popup:shown', callback)
  },

  removePopupShownListener: (): void => {
    ipcRenderer.removeAllListeners('popup:shown')
  }
}

contextBridge.exposeInMainWorld('api', api)

export type ElectronAPI = typeof api
