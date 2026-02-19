import { cn, formatDateFromMs } from '@renderer/utils'
import { NoteInfo } from '@shared/models'
import { ComponentProps } from 'react'

export type NotePreviewProps = NoteInfo & {
  isActive?: boolean
} & ComponentProps<'div'>

export const NotePreview = ({
  title,
  lastEditTime,
  ext,
  isActive = false,
  className,
  ...props
}: NotePreviewProps) => {
  const date = formatDateFromMs(lastEditTime)
  return (
    <div
      className={cn(
        'cursor-pointer px-3 py-2.5 rounded-xl transition-all duration-150 group relative',
        {
          'bg-[var(--ios-accent)] text-white shadow-sm': isActive,
          'text-[var(--ios-text)] hover:bg-[var(--ios-fill)]': !isActive
        },
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between mb-0.5">
        <h3 className="font-semibold truncate text-sm flex-1">{title}</h3>
        <span
          className={cn(
            'text-[10px] font-semibold px-1.5 py-0.5 rounded-md ml-2 uppercase shrink-0',
            {
              'bg-white/20 text-white': isActive,
              'bg-[var(--ios-fill)] text-[var(--ios-text-secondary)]': !isActive
            }
          )}
        >
          {ext.replace('.', '')}
        </span>
      </div>
      <span
        className={cn('inline-block w-full text-xs font-normal', {
          'text-white/70': isActive,
          'text-[var(--ios-text-secondary)]': !isActive
        })}
      >
        {date}
      </span>
    </div>
  )
}
