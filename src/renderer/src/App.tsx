import { useRef } from 'react'
import {
  ActionButtonRow,
  Content,
  DraggableTopBar,
  FloatingNoteTitle,
  MDEditor,
  NotePreviewList,
  RootLayout,
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
          <ActionButtonRow className="flex justify-end space-x-2 mt-1" />
          <NotePreviewList className="mt-3 space-y-1" onSelect={resetScroll} />
        </Sidebar>
        <Content className="bg-white" ref={contentContainerRef}>
          <FloatingNoteTitle className="pt-2" />
          <MDEditor />
        </Content>
      </RootLayout>
    </>
  )
}

export default App
