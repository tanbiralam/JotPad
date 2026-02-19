import { useEffect, useRef } from 'react'
import { LuPencil, LuPin, LuPinOff, LuTrash2 } from 'react-icons/lu'

interface NoteContextMenuProps {
  isOpen: boolean
  onClose: () => void
  isPinned: boolean
  onTogglePin: () => void
  onRename: () => void
  onDelete: () => void
}

export const NoteContextMenu = ({
  isOpen,
  onClose,
  isPinned,
  onTogglePin,
  onRename,
  onDelete
}: NoteContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    // Delay to prevent the click that opened the menu from immediately closing it
    requestAnimationFrame(() => {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    })

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const menuItems = [
    {
      icon: isPinned ? <LuPinOff className="w-3.5 h-3.5" /> : <LuPin className="w-3.5 h-3.5" />,
      label: isPinned ? 'Unpin' : 'Pin to Top',
      onClick: () => {
        onTogglePin()
        onClose()
      }
    },
    {
      icon: <LuPencil className="w-3.5 h-3.5" />,
      label: 'Rename',
      onClick: () => {
        onRename()
        onClose()
      }
    },
    {
      icon: <LuTrash2 className="w-3.5 h-3.5" />,
      label: 'Delete',
      onClick: () => {
        onDelete()
        onClose()
      },
      danger: true
    }
  ]

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-1 z-50 min-w-[150px] rounded-xl overflow-hidden animate-[contextMenuIn_0.15s_ease-out]"
      style={{
        backgroundColor: 'var(--ios-surface)',
        border: '1px solid var(--ios-separator)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.18)'
      }}
    >
      {menuItems.map((item, i) => (
        <button
          key={item.label}
          onClick={(e) => {
            e.stopPropagation()
            item.onClick()
          }}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium transition-colors cursor-pointer"
          style={{
            color: item.danger ? 'var(--ios-danger)' : 'var(--ios-text)',
            borderBottom: i < menuItems.length - 1 ? '1px solid var(--ios-separator)' : 'none'
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = item.danger
              ? 'rgba(255, 59, 48, 0.08)'
              : 'var(--ios-fill)')
          }
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  )
}
