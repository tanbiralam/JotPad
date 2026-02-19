interface DeleteConfirmModalProps {
  isOpen: boolean
  noteTitle?: string
  onCancel: () => void
  onConfirm: () => void
}

export const DeleteConfirmModal = ({
  isOpen,
  noteTitle,
  onCancel,
  onConfirm
}: DeleteConfirmModalProps) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(6px)' }}
      onClick={onCancel}
    >
      <div
        className="w-[320px] rounded-2xl overflow-hidden animate-[modalIn_0.2s_ease-out]"
        style={{
          backgroundColor: 'var(--ios-surface)',
          border: '1px solid var(--ios-separator)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-3 text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{ backgroundColor: 'rgba(255, 59, 48, 0.12)' }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--ios-danger)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </div>
          <h3 className="text-base font-semibold" style={{ color: 'var(--ios-text)' }}>
            Delete Note
          </h3>
          <p className="text-sm mt-1.5 leading-snug" style={{ color: 'var(--ios-text-secondary)' }}>
            Are you sure you want to delete{' '}
            <strong style={{ color: 'var(--ios-text)' }}>{noteTitle ?? 'this note'}</strong>? It
            will be moved to Trash and auto-purged after 30 days.
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: 'var(--ios-separator)' }} />

        {/* Actions */}
        <div className="flex">
          <button
            onClick={onCancel}
            className="flex-1 py-3.5 text-sm font-medium transition-colors cursor-pointer"
            style={{
              color: 'var(--ios-accent)',
              backgroundColor: 'transparent',
              borderRight: '1px solid var(--ios-separator)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--ios-fill)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3.5 text-sm font-semibold transition-colors cursor-pointer"
            style={{
              color: 'var(--ios-danger)',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = 'rgba(255, 59, 48, 0.08)')
            }
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Delete
          </button>
        </div>
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
