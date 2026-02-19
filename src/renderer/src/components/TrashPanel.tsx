import { TrashInfo } from '@shared/models'
import { useCallback, useEffect, useState } from 'react'
import { LuArchiveRestore, LuTrash2 } from 'react-icons/lu'

interface TrashPanelProps {
  isOpen: boolean
  onClose: () => void
  onRestored: () => void
}

const formatTimeAgo = (timestamp: number) => {
  const days = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return '1 day ago'
  if (days < 30) return `${days} days ago`
  return `${Math.floor(days / 30)} month(s) ago`
}

export const TrashPanel = ({ isOpen, onClose, onRestored }: TrashPanelProps) => {
  const [trashItems, setTrashItems] = useState<TrashInfo[]>([])
  const [loading, setLoading] = useState(false)

  const loadTrash = useCallback(async () => {
    setLoading(true)
    const items = await window.context.getTrash()
    setTrashItems(items.sort((a, b) => b.deletedAt - a.deletedAt))
    setLoading(false)
  }, [])

  useEffect(() => {
    if (isOpen) loadTrash()
  }, [isOpen, loadTrash])

  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const handleRestore = async (title: string, ext: string) => {
    const success = await window.context.restoreNote(title, ext)
    if (success) {
      setTrashItems((prev) => prev.filter((item) => item.title !== title))
      onRestored()
    }
  }

  const handleEmptyTrash = async () => {
    const success = await window.context.emptyTrash()
    if (success) {
      setTrashItems([])
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="w-[420px] max-h-[500px] rounded-2xl overflow-hidden flex flex-col animate-[modalIn_0.2s_ease-out]"
        style={{
          backgroundColor: 'var(--ios-surface)',
          border: '1px solid var(--ios-separator)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255, 59, 48, 0.12)' }}
            >
              <LuTrash2 className="w-4 h-4" style={{ color: 'var(--ios-danger)' }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--ios-text)' }}>
                Trash
              </h3>
              <span className="text-[11px]" style={{ color: 'var(--ios-text-secondary)' }}>
                {trashItems.length} {trashItems.length === 1 ? 'item' : 'items'} · Auto-purge after
                30 days
              </span>
            </div>
          </div>
          {trashItems.length > 0 && (
            <button
              onClick={handleEmptyTrash}
              className="text-xs font-medium px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              style={{
                color: 'var(--ios-danger)',
                backgroundColor: 'rgba(255, 59, 48, 0.08)'
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = 'rgba(255, 59, 48, 0.16)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = 'rgba(255, 59, 48, 0.08)')
              }
            >
              Empty Trash
            </button>
          )}
        </div>

        <div style={{ height: '1px', backgroundColor: 'var(--ios-separator)' }} />

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-6 text-center">
              <span className="text-sm" style={{ color: 'var(--ios-text-secondary)' }}>
                Loading...
              </span>
            </div>
          ) : trashItems.length === 0 ? (
            <div className="p-8 text-center">
              <LuTrash2
                className="w-8 h-8 mx-auto mb-2"
                style={{ color: 'var(--ios-text-secondary)', opacity: 0.4 }}
              />
              <span className="text-sm" style={{ color: 'var(--ios-text-secondary)' }}>
                Trash is empty
              </span>
            </div>
          ) : (
            trashItems.map((item) => (
              <div
                key={`${item.title}${item.ext}`}
                className="flex items-center justify-between px-4 py-2.5 transition-colors"
                style={{ borderBottom: '1px solid var(--ios-separator)' }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-sm font-medium truncate"
                      style={{ color: 'var(--ios-text)' }}
                    >
                      {item.title}
                    </span>
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md uppercase shrink-0"
                      style={{
                        backgroundColor: 'var(--ios-fill)',
                        color: 'var(--ios-text-secondary)'
                      }}
                    >
                      {item.ext.replace('.', '')}
                    </span>
                  </div>
                  <span className="text-[11px]" style={{ color: 'var(--ios-text-secondary)' }}>
                    Deleted {formatTimeAgo(item.deletedAt)}
                  </span>
                </div>
                <button
                  onClick={() => handleRestore(item.title, item.ext)}
                  className="p-1.5 rounded-lg transition-colors cursor-pointer"
                  style={{ color: 'var(--ios-accent)' }}
                  title="Restore"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = 'rgba(10, 132, 255, 0.1)')
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <LuArchiveRestore className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Close button */}
        <div style={{ height: '1px', backgroundColor: 'var(--ios-separator)' }} />
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
