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
        <Sidebar className="p-2">
          <ActionButtonRow className="flex justify-between mt-1" />
          <NotePreviewList className="mt-3 space-y-1" onSelect={resetScroll} />
        </Sidebar>
        <Content className="border-l bg-zinc-900/50 border-l-white/20" ref={contentContainerRef}>
          <FloatingNoteTitle className="pt-2" />
          <MDEditor />
        </Content>
      </RootLayout>
    </>
  )
}

export default App
