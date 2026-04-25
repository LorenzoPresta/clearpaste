import { useState } from 'react'
import { PinIcon, SparklesIcon } from '../../shared/Icons'
import type { ClipboardItem } from '../../../shared/types'

interface ClipboardItemProps {
  item: ClipboardItem
  index: number
  isSelected: boolean
  shortcutKey?: string
  onSelect: () => void
  onCopy: () => void
  onPaste: () => void
  onDelete: () => void
  onPin: () => void
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function truncateText(text: string, maxLength: number = 80): string {
  const singleLine = text.replace(/\n/g, ' ↩ ').replace(/\s+/g, ' ').trim()
  if (singleLine.length <= maxLength) return singleLine
  return singleLine.slice(0, maxLength) + '…'
}

export default function ClipboardItemComponent({
  item,
  index,
  isSelected,
  shortcutKey,
  onSelect,
  onCopy,
  onPaste,
  onDelete,
  onPin
}: ClipboardItemProps) {
  const [showContextMenu, setShowContextMenu] = useState(false)

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowContextMenu(true)

    // Close on next click anywhere
    const close = () => {
      setShowContextMenu(false)
      document.removeEventListener('click', close)
    }
    setTimeout(() => document.addEventListener('click', close), 0)
  }

  const handleClick = (e: React.MouseEvent) => {
    if (e.altKey) {
      onPaste()
    } else {
      onCopy()
    }
  }

  // Stagger animation delay
  const animDelay = Math.min(index * 0.03, 0.3)

  return (
    <div
      className={`clipboard-item ${isSelected ? 'selected' : ''} ${item.isPinned ? 'pinned' : ''}`}
      data-index={index}
      onClick={handleClick}
      onMouseEnter={onSelect}
      onContextMenu={handleContextMenu}
      title={item.content}
      style={{ animationDelay: `${animDelay}s` }}
    >
      <div className="item-content">
        {item.isPinned && <span className="pin-icon"><PinIcon size={11} color="#fbbf24" /></span>}
        <span className="item-text">{truncateText(item.content)}</span>
      </div>
      <div className="item-meta">
        {item.isCleaned && (
          <span className="clean-badge" title={`${item.charsRemoved} invisible character${item.charsRemoved > 1 ? 's' : ''} removed`}>
            <SparklesIcon size={10} color="#22d3ee" /> {item.charsRemoved}
          </span>
        )}
        <span className="item-time">{formatTimeAgo(item.timestamp)}</span>
        {shortcutKey && <span className="item-shortcut">{shortcutKey}</span>}
      </div>

      {showContextMenu && (
        <div className="context-menu">
          <button onClick={(e) => { e.stopPropagation(); onCopy(); }}>
            Copy
            <span className="menu-shortcut">↩</span>
          </button>
          <button onClick={(e) => { e.stopPropagation(); onPaste(); }}>
            Paste
            <span className="menu-shortcut">⌥↩</span>
          </button>
          <div className="menu-separator" />
          <button onClick={(e) => { e.stopPropagation(); onPin(); }}>
            {item.isPinned ? 'Unpin' : 'Pin'}
            <span className="menu-shortcut">⌥P</span>
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="danger">
            Delete
            <span className="menu-shortcut">⌥⌫</span>
          </button>
        </div>
      )}
    </div>
  )
}
