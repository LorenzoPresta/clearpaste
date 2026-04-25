import {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  clipboard,
  screen,
  shell
} from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { createTray, getTrayBounds } from './tray'
import { startMonitoring, restartMonitoring } from './clipboard-monitor'
import {
  getHistory,
  searchHistory,
  deleteHistoryItem,
  pinHistoryItem,
  clearHistory,
  getSettings,
  updateSettings,
  getStats
} from './store'
import { cleanText } from './text-cleaner'

let popupWindow: BrowserWindow | null = null
let settingsWindow: BrowserWindow | null = null

// Hide from dock — menu bar only app
app.dock?.hide()

app.setAboutPanelOptions({
  applicationName: 'ClearPaste',
  applicationVersion: app.getVersion(),
  version: '',
  copyright: '© 2026 ClearPaste @LorenzoPresta',
  credits: 'Clipboard manager with Automated text cleaning'
})

function createPopupWindow(): BrowserWindow {
  const trayBounds = getTrayBounds()
  const display = screen.getPrimaryDisplay()
  const settings = getSettings()

  let x = Math.round(display.workArea.width / 2 - 180)
  let y = 0

  if (trayBounds && settings.popupPosition === 'tray') {
    x = Math.round(trayBounds.x + trayBounds.width / 2 - 180)
    y = trayBounds.y + trayBounds.height + 4
  } else if (settings.popupPosition === 'center') {
    x = Math.round(display.workArea.width / 2 - 180)
    y = Math.round(display.workArea.height / 2 - 250)
  }

  const win = new BrowserWindow({
    width: 360,
    height: 500,
    x,
    y,
    frame: false,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    transparent: true,
    vibrancy: 'under-window',
    visualEffectState: 'active',
    backgroundColor: '#00000000',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/popup/`)
  } else {
    win.loadFile(join(__dirname, '../renderer/popup/index.html'))
  }

  win.on('blur', () => {
    win.hide()
  })

  win.on('closed', () => {
    popupWindow = null
  })

  return win
}

function createSettingsWindow(): BrowserWindow {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.focus()
    return settingsWindow
  }

  const win = new BrowserWindow({
    width: 680,
    height: 520,
    minWidth: 600,
    minHeight: 450,
    title: 'ClearPaste Preferences',
    titleBarStyle: 'hiddenInset',
    vibrancy: 'window',
    visualEffectState: 'active',
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/settings/`)
  } else {
    win.loadFile(join(__dirname, '../renderer/settings/index.html'))
  }

  win.once('ready-to-show', () => {
    win.show()
  })

  win.on('closed', () => {
    settingsWindow = null
  })

  return win
}

function togglePopup(): void {
  if (!popupWindow || popupWindow.isDestroyed()) {
    popupWindow = createPopupWindow()
  }

  if (popupWindow.isVisible()) {
    popupWindow.hide()
  } else {
    // Reposition before showing
    const trayBounds = getTrayBounds()
    const settings = getSettings()

    if (trayBounds && settings.popupPosition === 'tray') {
      const x = Math.round(trayBounds.x + trayBounds.width / 2 - 180)
      const y = trayBounds.y + trayBounds.height + 4
      popupWindow.setPosition(x, y, false)
    }

    popupWindow.show()
    popupWindow.focus()
    popupWindow.webContents.send('popup:shown')
  }
}

function openSettings(): void {
  settingsWindow = createSettingsWindow()
}

// --- IPC Handlers ---

function setupIpcHandlers(): void {
  ipcMain.handle('clipboard:get-history', () => {
    return getHistory()
  })

  ipcMain.handle('clipboard:search', (_event, query: string) => {
    return searchHistory(query)
  })

  ipcMain.handle('clipboard:delete-item', (_event, id: string) => {
    deleteHistoryItem(id)
    return getHistory()
  })

  ipcMain.handle('clipboard:pin-item', (_event, id: string) => {
    pinHistoryItem(id)
    return getHistory()
  })

  ipcMain.handle('clipboard:paste-item', (_event, id: string) => {
    const history = getHistory()
    const item = history.find(h => h.id === id)
    if (!item) return

    clipboard.writeText(item.content)

    const settings = getSettings()
    if (settings.pasteAutomatically) {
      // Hide popup first
      popupWindow?.hide()
      // Simulate Cmd+V after a brief delay
      setTimeout(() => {
        const { exec } = require('child_process')
        exec(`osascript -e 'tell application "System Events" to keystroke "v" using command down'`)
      }, 100)
    }
  })

  ipcMain.handle('clipboard:copy-item', (_event, id: string) => {
    const history = getHistory()
    const item = history.find(h => h.id === id)
    if (!item) return
    clipboard.writeText(item.content)
    popupWindow?.hide()
  })

  ipcMain.handle('clipboard:clear-history', (_event, includePinned: boolean) => {
    clearHistory(includePinned)
    return getHistory()
  })

  ipcMain.handle('clipboard:clean-text', (_event, text: string) => {
    const settings = getSettings()
    return cleanText(text, settings)
  })

  ipcMain.handle('settings:get', () => {
    return getSettings()
  })

  ipcMain.handle('settings:update', (_event, partial: Record<string, unknown>) => {
    const updated = updateSettings(partial)
    // Restart monitoring if interval changed
    if ('clipboardCheckInterval' in partial) {
      restartMonitoring()
    }
    // Re-register shortcut if hotkey changed
    if ('hotkey' in partial) {
      registerGlobalShortcut()
    }
    return updated
  })

  ipcMain.handle('window:close-popup', () => {
    popupWindow?.hide()
  })

  ipcMain.handle('window:open-settings', () => {
    openSettings()
  })

  ipcMain.handle('app:get-stats', () => {
    return getStats()
  })

  ipcMain.handle('app:get-version', () => {
    return app.getVersion()
  })
}

// --- Global Shortcut ---

function registerGlobalShortcut(): void {
  globalShortcut.unregisterAll()

  const settings = getSettings()
  const hotkey = settings.hotkey || 'Shift+CommandOrControl+V'

  try {
    globalShortcut.register(hotkey, () => {
      togglePopup()
    })
  } catch (err) {
    console.error('Failed to register global shortcut:', err)
    // Fallback to default
    globalShortcut.register('Shift+CommandOrControl+V', () => {
      togglePopup()
    })
  }
}

// --- App Lifecycle ---

app.whenReady().then(() => {
  setupIpcHandlers()
  createTray(togglePopup, openSettings)
  registerGlobalShortcut()
  startMonitoring()

  // Pre-create popup window for faster first show
  popupWindow = createPopupWindow()
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

app.on('window-all-closed', (e: Event) => {
  // Prevent app from quitting when all windows are closed
  e.preventDefault()
})
