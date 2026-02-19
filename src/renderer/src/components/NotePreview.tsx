import { cn, formatDateFromMs } from '@renderer/utils'
import { NoteInfo } from '@shared/models'
import { ComponentProps } from 'react'

export type NotePreviewProps = NoteInfo & {
  isActive?: boolean
} & ComponentProps<'div'>

export const NotePreview = ({
  title,
  lastEditTime,
  isActive = false,
  className,
  ...props
}: NotePreviewProps) => {
  const date = formatDateFromMs(lastEditTime)
  return (
    <div
      className={cn(
        'cursor-pointer px-3 py-2.5 rounded-xl transition-all duration-150 group',
        {
          'bg-[var(--color-ios-accent)] text-white shadow-sm': isActive,
          'text-[var(--color-ios-text)] hover:bg-[var(--color-ios-fill)]': !isActive
        },
        className
      )}
      {...props}
    >
      <h3 className="mb-0.5 font-semibold truncate text-sm">{title}</h3>
      <span
        className={cn('inline-block w-full text-xs font-normal', {
          'text-white/70': isActive,
          'text-[var(--color-ios-text-secondary)]': !isActive
        })}
      >
        {date}
      </span>
    </div>
  )
}
