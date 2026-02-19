import { cn, formatDateFromMs } from '@renderer/utils'
import { NoteInfo } from '@shared/models'
import { ComponentProps, useRef, useState } from 'react'
import { LuMoreHorizontal } from 'react-icons/lu'
import { NoteContextMenu } from './NoteContextMenu'

export type NotePreviewProps = NoteInfo & {
  isActive?: boolean
  isPinned?: boolean
  onTogglePin?: () => void
  onRename?: (newTitle: string) => void
  onDelete?: () => void
} & ComponentProps<'div'>

export const NotePreview = ({
  title,
  lastEditTime,
  ext,
  isActive = false,
  isPinned = false,
  onTogglePin,
  onRename,
  onDelete,
  className,
  ...props
}: NotePreviewProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(title)
  const [showMenu, setShowMenu] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const handleRename = () => {
    if (editedTitle.trim() && editedTitle !== title && onRename) {
      onRename(editedTitle)
    } else {
      setEditedTitle(title)
    }
    setIsEditing(false)
  }

  const date = formatDateFromMs(lastEditTime)
  return (
    <div
      className={cn(
        'cursor-pointer px-3 py-2.5 rounded-xl transition-all duration-150 group relative',
        {
          'bg-(--ios-accent) text-white shadow-sm': isActive,
          'text-(--ios-text) hover:bg-(--ios-fill)': !isActive
        },
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between mb-0.5">
        {isEditing ? (
          <input
            autoFocus
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename()
              if (e.key === 'Escape') {
                setEditedTitle(title)
                setIsEditing(false)
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 bg-transparent outline-none font-semibold text-sm min-w-0 text-(--ios-text)"
          />
        ) : (
          <h3
            className="font-semibold truncate text-sm flex-1"
            onDoubleClick={(e) => {
              e.stopPropagation()
              setIsEditing(true)
            }}
          >
            {title}
          </h3>
        )}
        <div className="flex items-center gap-1.5">
          {/* Three-dot menu button */}
          <button
            ref={menuButtonRef}
            className={cn(
              'p-1 rounded-md transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/10',
              isActive ? 'text-white/80 hover:text-white' : 'text-zinc-400 hover:text-zinc-600',
              !showMenu && 'opacity-0 group-hover:opacity-100'
            )}
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            title="More actions"
          >
            <LuMoreHorizontal className="w-4 h-4" />
          </button>
          {/* Extension badge */}
          <span
            className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-md uppercase shrink-0', {
              'bg-white/20 text-white': isActive,
              'bg-(--ios-fill) text-(--ios-text-secondary)': !isActive
            })}
          >
            {ext.replace('.', '')}
          </span>
        </div>
      </div>
      <span
        className={cn('inline-block w-full text-xs font-normal', {
          'text-white/70': isActive,
          'text-(--ios-text-secondary)': !isActive
        })}
      >
        {date}
      </span>

      {/* Context Menu */}
      <NoteContextMenu
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        isPinned={isPinned}
        onTogglePin={() => onTogglePin?.()}
        onRename={() => setIsEditing(true)}
        onDelete={() => onDelete?.()}
        anchorRef={menuButtonRef}
      />
    </div>
  )
}
