import { useNotesList } from '@renderer/hooks/useNotesList'
import { pinnedNotesAtom, togglePinNote } from '@renderer/store'
import { useAtomValue, useSetAtom } from 'jotai'
import { isEmpty } from 'lodash'
import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { NotePreview } from './NotePreview'

export type NotePreviewListProps = ComponentProps<'ul'> & {
  onSelect?: () => void
}

export const NotePreviewList = ({ onSelect, className, ...props }: NotePreviewListProps) => {
  const { notes, selectedNoteIndex, handleNoteSelect } = useNotesList({ onSelect })
  const pinnedNotes = useAtomValue(pinnedNotesAtom)
  const togglePin = useSetAtom(togglePinNote)
  const rename = useSetAtom(renameNote)

  if (!notes) return null

  if (isEmpty(notes)) {
    return (
      <ul className={twMerge('text-center pt-8', className)} {...props}>
        <span className="text-sm" style={{ color: 'var(--ios-text-secondary)' }}>
          No notes found
        </span>
      </ul>
    )
  }
  return (
    <ul className={className} {...props}>
      {notes.map((note, index) => (
        <NotePreview
          key={note.title + note.lastEditTime}
          isActive={selectedNoteIndex === index}
          onClick={handleNoteSelect(index)}
          isPinned={pinnedNotes.includes(note.title)}
          onTogglePin={(e) => {
            e.stopPropagation()
            togglePin(note.title)
          }}
          onRename={async (newTitle) => {
            await rename({ oldTitle: note.title, newTitle })
          }}
          {...note}
        />
      ))}
    </ul>
  )
}
