import { resolvedThemeAtom } from '@renderer/store'
import { useAtomValue } from 'jotai'
import { useEffect, useRef } from 'react'
import {
  ActionButtonRow,
  Content,
  DraggableTopBar,
  FloatingNoteTitle,
  MDEditor,
  NotePreviewList,
  RootLayout,
  SearchBar,
  Sidebar,
  ThemeToggle
} from './components'

const App = () => {
  const contentContainerRef = useRef<HTMLDivElement>(null)
  const resolvedTheme = useAtomValue(resolvedThemeAtom)

  // Apply dark class to document root
  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
  }, [resolvedTheme])

  const resetScroll = () => {
    contentContainerRef.current?.scrollTo(0, 0)
  }

  return (
    <>
      <DraggableTopBar />
      <RootLayout>
        <Sidebar className="p-3">
          <div className="flex items-center justify-between mt-1">
            <ActionButtonRow className="flex space-x-2" />
            <ThemeToggle />
          </div>
          <SearchBar className="mt-3" />
          <NotePreviewList
            className="mt-3 space-y-1 flex-1 overflow-y-auto"
            onSelect={resetScroll}
          />
        </Sidebar>
        <Content ref={contentContainerRef}>
          <FloatingNoteTitle />
          <MDEditor />
        </Content>
      </RootLayout>
    </>
  )
}

export default App
