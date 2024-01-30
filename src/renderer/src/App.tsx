import { ActionButtonRow, Content, DraggableTopBar, RootLayout, Sidebar } from './components'

const App = () => {
  return (
    <>
      <DraggableTopBar />
      <RootLayout>
        <Sidebar className="p-2">
          <ActionButtonRow className="flex justify-between mt-1" />
        </Sidebar>
        <Content className="border-l bg-zinc-900/50 border-l-white/20">Content</Content>
      </RootLayout>
    </>
  )
}

export default App

//https://youtu.be/t8ane4BDyC8?t=3334
