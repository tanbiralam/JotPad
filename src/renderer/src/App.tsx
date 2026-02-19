import { useRef } from 'react'
import {
  ActionButtonRow,
  Content,
  DraggableTopBar,
  FloatingNoteTitle,
  MDEditor,
  NotePreviewList,
  RootLayout,
  SearchBar,
  Sidebar
} from './components'

const App = () => {
  const contentContainerRef = useRef<HTMLDivElement>(null)

  const resetScroll = () => {
    contentContainerRef.current?.scrollTo(0, 0)
  }

  return (
    <>
      <DraggableTopBar />
      <RootLayout>
        <Sidebar className="p-3">
          <ActionButtonRow className="flex justify-between space-x-2 mt-1" />
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
