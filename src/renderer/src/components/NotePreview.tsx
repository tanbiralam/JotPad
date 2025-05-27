import { cn, formatDateFromMs } from '@renderer/utils'
import { NoteInfo } from '@shared/models'
import { ComponentProps } from 'react'

export type NotePreviewProps = NoteInfo & {
  isActive?: boolean
} & ComponentProps<'div'>

export const NotePreview = ({
  title,
  content,
  lastEditTime,
  isActive = false,
  className,
  ...props
}: NotePreviewProps) => {
  const date = formatDateFromMs(lastEditTime)
  return (
    <div
      className={cn(
        'cursor-pointer px-3 py-2 rounded-md transition-colors duration-100',
        {
          'bg-neutral-200 text-neutral-800': isActive,
          'text-neutral-700 hover:bg-neutral-100': !isActive
        },
        className
      )}
      {...props}
    >
      <h3 className="mb-0.5 font-semibold truncate text-sm">{title}</h3>
      <span className="inline-block w-full text-xs text-neutral-500 font-normal">{date}</span>
    </div>
  )
}
