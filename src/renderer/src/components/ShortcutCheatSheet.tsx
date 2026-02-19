import { useEffect } from 'react'

interface ShortcutCheatSheetProps {
  isOpen: boolean
  onClose: () => void
}

const shortcuts = [
  {
    category: 'Notes',
    items: [
      { keys: ['Ctrl', 'N'], action: 'New Note' },
      { keys: ['Ctrl', 'Shift', 'D'], action: 'Delete Note' },
      { keys: ['Ctrl', 'Shift', 'E'], action: 'Export as PDF' }
    ]
  },
  {
    category: 'Navigation',
    items: [
      { keys: ['Ctrl', 'F'], action: 'Search Notes' },
      { keys: ['Double Click'], action: 'Rename Note' }
    ]
  },
  {
    category: 'View',
    items: [{ keys: ['Ctrl', '/'], action: 'Toggle Shortcuts' }]
  }
]

const isMac =
  typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0

const formatKey = (key: string) => {
  if (!isMac) return key
  return key.replace('Ctrl', '⌘').replace('Shift', '⇧').replace('Alt', '⌥')
}

export const ShortcutCheatSheet = ({ isOpen, onClose }: ShortcutCheatSheetProps) => {
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="w-[380px] rounded-2xl overflow-hidden animate-[modalIn_0.2s_ease-out]"
        style={{
          backgroundColor: 'var(--ios-surface)',
          border: '1px solid var(--ios-separator)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-3 text-center">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2.5"
            style={{ backgroundColor: 'rgba(10, 132, 255, 0.12)' }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--ios-accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10" />
            </svg>
          </div>
          <h3 className="text-base font-semibold" style={{ color: 'var(--ios-text)' }}>
            Keyboard Shortcuts
          </h3>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: 'var(--ios-separator)' }} />

        {/* Shortcuts list */}
        <div className="px-5 py-3 max-h-[400px] overflow-y-auto">
          {shortcuts.map((group) => (
            <div key={group.category} className="mb-3 last:mb-1">
              <h4
                className="text-[11px] font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: 'var(--ios-text-secondary)' }}
              >
                {group.category}
              </h4>
              {group.items.map((shortcut) => (
                <div key={shortcut.action} className="flex items-center justify-between py-1.5">
                  <span className="text-[13px]" style={{ color: 'var(--ios-text)' }}>
                    {shortcut.action}
                  </span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key) => (
                      <kbd
                        key={key}
                        className="inline-flex items-center justify-center min-w-[24px] h-[22px] px-1.5 rounded-md text-[11px] font-medium"
                        style={{
                          backgroundColor: 'var(--ios-fill)',
                          color: 'var(--ios-text)',
                          border: '1px solid var(--ios-separator)',
                          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                        }}
                      >
                        {formatKey(key)}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: 'var(--ios-separator)' }} />

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full py-3 text-sm font-medium transition-colors cursor-pointer"
          style={{ color: 'var(--ios-accent)', backgroundColor: 'transparent' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--ios-fill)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          Close
        </button>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
