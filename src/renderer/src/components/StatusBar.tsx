import { selectedNoteAtom } from '@renderer/store'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'

export const StatusBar = () => {
  const selectedNote = useAtomValue(selectedNoteAtom)

  const stats = useMemo(() => {
    if (!selectedNote) return { words: 0, chars: 0, readingTime: 0 }

    const text = selectedNote.content
    const words = text
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length
    const chars = text.length
    const readingTime = Math.ceil(words / 200)

    return { words, chars, readingTime }
  }, [selectedNote?.content])

  if (!selectedNote) return null

  return (
    <div
      className="status-bar flex items-center justify-end px-4 py-1.5 text-xs font-medium space-x-4 border-t transition-colors duration-150"
      style={{
        backgroundColor: 'var(--ios-surface)',
        borderColor: 'var(--ios-separator)',
        color: 'var(--ios-text-secondary)'
      }}
    >
      <span>
        {stats.words} {stats.words === 1 ? 'word' : 'words'}
      </span>
      <span>
        {stats.chars} {stats.chars === 1 ? 'character' : 'characters'}
      </span>
    </div>
  )
}
