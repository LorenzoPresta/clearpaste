import { Tray, Menu, nativeImage, app } from 'electron'
import * as path from 'path'
import { toggleIgnoreMode, setIgnoreNextCopy, getIgnoreMode } from './clipboard-monitor'

let tray: Tray | null = null

export function createTray(
  onTogglePopup: () => void,
  onOpenSettings: () => void
): Tray {
  // Use a simple template icon for macOS
  const iconPath = path.join(__dirname, '../../resources/trayIconTemplate.png')

  let icon: nativeImage
  try {
    icon = nativeImage.createFromPath(iconPath)
    icon = icon.resize({ width: 18, height: 18 })
  } catch {
    // Fallback: create a simple icon programmatically
    icon = nativeImage.createEmpty()
  }

  tray = new Tray(icon)
  tray.setToolTip('ClearPaste')

  // Click to toggle popup
  tray.on('click', (_event, bounds) => {
    onTogglePopup()
  })

  // Right-click for context menu
  tray.on('right-click', () => {
    const isIgnoring = getIgnoreMode()
    const contextMenu = Menu.buildFromTemplate([
      {
        label: isIgnoring ? '✓ Ignoring New Copies' : 'Ignore New Copies',
        click: () => toggleIgnoreMode()
      },
      {
        label: 'Ignore Next Copy',
        click: () => setIgnoreNextCopy()
      },
      { type: 'separator' },
      {
        label: 'Preferences...',
        accelerator: 'CommandOrControl+,',
        click: () => onOpenSettings()
      },
      { type: 'separator' },
      {
        label: 'About ClearPaste',
        click: () => {
          app.showAboutPanel()
        }
      },
      {
        label: 'Quit ClearPaste',
        accelerator: 'CommandOrControl+Q',
        click: () => app.quit()
      }
    ])
    tray?.popUpContextMenu(contextMenu)
  })

  return tray
}

export function getTray(): Tray | null {
  return tray
}

export function getTrayBounds() {
  return tray?.getBounds()
}
