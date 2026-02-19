import { createNote, deleteNote, notesAtom, resolvedThemeAtom } from '@renderer/store'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import {
  ActionButtonRow,
  Content,
  DraggableTopBar,
  FloatingNoteTitle,
  MDEditor,
  NotePreviewList,
  RootLayout,
  SearchBar,
  ShortcutCheatSheet,
  Sidebar,
  StatusBar,
  ThemeToggle,
  TrashPanel
} from './components'
import { useNoteNavigation } from './hooks/useNoteNavigation'

const App = () => {
  const contentContainerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const resolvedTheme = useAtomValue(resolvedThemeAtom)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showTrash, setShowTrash] = useState(false)
  const setNotes = useSetAtom(notesAtom)

  const createEmptyNote = useSetAtom(createNote)
  const deleteEmptyNote = useSetAtom(deleteNote)

  useNoteNavigation()

  // Apply dark class to document root
  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
  }, [resolvedTheme])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey

      // Ctrl/Cmd + N -> New Note
      if (isCmdOrCtrl && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        await createEmptyNote()
      }

      // Ctrl/Cmd + Shift + D -> Delete Note
      if (isCmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        await deleteEmptyNote()
      }

      // Ctrl/Cmd + F -> Focus Search
      if (isCmdOrCtrl && e.key.toLowerCase() === 'f') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }

      // Ctrl/Cmd + Shift + E -> Export PDF
      if (isCmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault()
        window.context.exportPDF()
      }

      // Ctrl/Cmd + / -> Toggle Shortcuts Cheat Sheet
      if (isCmdOrCtrl && e.key === '/') {
        e.preventDefault()
        setShowShortcuts((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [createEmptyNote, deleteEmptyNote])

  const resetScroll = () => {
    contentContainerRef.current?.scrollTo(0, 0)
  }

  return (
    <>
      <DraggableTopBar />
      <RootLayout>
        <Sidebar className="p-3">
          <div className="flex items-center justify-between mt-1">
            <ActionButtonRow className="flex space-x-2" onOpenTrash={() => setShowTrash(true)} />
            <ThemeToggle />
          </div>
          <SearchBar ref={searchInputRef} className="mt-3" />
          <NotePreviewList
            className="mt-3 space-y-1 flex-1 overflow-y-auto"
            onSelect={resetScroll}
          />
        </Sidebar>
        <div className="flex-1 flex flex-col h-screen">
          <Content ref={contentContainerRef} className="border-l bg-zinc-900/50 border-white/20">
            <FloatingNoteTitle />
            <MDEditor />
          </Content>
          <StatusBar />
        </div>
      </RootLayout>
      <ShortcutCheatSheet isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
      <TrashPanel
        isOpen={showTrash}
        onClose={() => setShowTrash(false)}
        onRestored={async () => {
          const notes = await window.context.getNotes()
          setNotes(notes)
        }}
      />
    </>
  )
}

export default App
