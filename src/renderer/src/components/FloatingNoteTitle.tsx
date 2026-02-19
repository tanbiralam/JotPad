import { selectedNoteAtom } from '@renderer/store'
import { useAtomValue } from 'jotai'
import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export const FloatingNoteTitle = ({ className, ...props }: ComponentProps<'div'>) => {
  const selectedNote = useAtomValue(selectedNoteAtom)

  if (!selectedNote) return null

  return (
    <div
      className={twMerge('flex justify-center py-3 sticky top-0 z-5', className)}
      style={{
        backgroundColor: 'var(--color-ios-surface)',
        borderBottom: '1px solid var(--color-ios-separator)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
      {...props}
    >
      <span className="font-semibold text-base" style={{ color: 'var(--color-ios-text)' }}>
        {selectedNote.title}
      </span>
    </div>
  )
}
