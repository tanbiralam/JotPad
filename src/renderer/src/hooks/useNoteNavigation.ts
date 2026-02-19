import { notesAtom, selectedNoteIndexAtom } from '@renderer/store'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'

export const useNoteNavigation = () => {
  const notes = useAtomValue(notesAtom)
  const setSelectedNoteIndex = useSetAtom(selectedNoteIndexAtom)

  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a')

      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href) return

      // Check if it's an external link
      if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:')) {
        // Let electron handle external links via setWindowOpenHandler
        return
      }

      // It's likely a note link
      e.preventDefault()

      const decodedHref = decodeURIComponent(href)
      // Try to find note by title (with or without extension)
      const targetNoteIndex = notes?.findIndex((n) => {
        return (
          n.title === decodedHref ||
          n.title === decodedHref.replace(/\.md$/, '') ||
          n.title === decodedHref.replace(/\.txt$/, '')
        )
      })

      if (targetNoteIndex !== undefined && targetNoteIndex !== -1) {
        setSelectedNoteIndex(targetNoteIndex)
      } else {
        console.warn(`Note not found: ${decodedHref}`)
      }
    }

    document.addEventListener('click', handleLinkClick)

    return () => {
      document.removeEventListener('click', handleLinkClick)
    }
  }, [notes, setSelectedNoteIndex])
}
