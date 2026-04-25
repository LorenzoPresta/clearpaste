import { forwardRef } from 'react'
import ClipboardItemComponent from './ClipboardItem'
import type { ClipboardItem } from '../../../shared/types'

interface ClipboardListProps {
  items: ClipboardItem[]
  selectedIndex: number
  onSelect: (index: number) => void
  onCopy: (id: string) => void
  onPaste: (id: string) => void
  onDelete: (id: string) => void
  onPin: (id: string) => void
}

const ClipboardList = forwardRef<HTMLDivElement, ClipboardListProps>(
  ({ items, selectedIndex, onSelect, onCopy, onPaste, onDelete, onPin }, ref) => {
    if (items.length === 0) {
      return (
        <div className="clipboard-list-empty" ref={ref}>
          <div className="empty-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
              <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
            </svg>
          </div>
          <span className="empty-text">No clipboard history</span>
          <span className="empty-hint">Copy something to get started</span>
        </div>
      )
    }

    // Find separator between pinned and unpinned
    const firstUnpinnedIndex = items.findIndex(item => !item.isPinned)
    const hasPinnedItems = firstUnpinnedIndex > 0

    return (
      <div className="clipboard-list" ref={ref}>
        {items.map((item, index) => (
          <div key={item.id}>
            {hasPinnedItems && index === firstUnpinnedIndex && (
              <div className="list-separator">
                <span>History</span>
              </div>
            )}
            <ClipboardItemComponent
              item={item}
              index={index}
              isSelected={index === selectedIndex}
              shortcutKey={index < 9 ? `⌘${index + 1}` : undefined}
              onSelect={() => onSelect(index)}
              onCopy={() => onCopy(item.id)}
              onPaste={() => onPaste(item.id)}
              onDelete={() => onDelete(item.id)}
              onPin={() => onPin(item.id)}
            />
          </div>
        ))}
      </div>
    )
  }
)

ClipboardList.displayName = 'ClipboardList'

export default ClipboardList
