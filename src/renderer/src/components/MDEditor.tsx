import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  Separator,
  headingsPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin
} from '@mdxeditor/editor'
import { useMD } from '@renderer/hooks/useMD'

export const MDEditor = () => {
  const { editorRef, selectedNote, handleAutoSaving, handleBlur } = useMD()

  if (!selectedNote) return null

  return (
    <MDXEditor
      ref={editorRef}
      key={selectedNote.title}
      markdown={selectedNote.content}
      onChange={handleAutoSaving}
      onBlur={handleBlur}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <BlockTypeSelect />
              <Separator />
              <BoldItalicUnderlineToggles />
              <Separator />
              <ListsToggle />
              <Separator />
              <CreateLink />
              <InsertThematicBreak />
            </>
          )
        })
      ]}
      contentEditableClassName="outline-none min-h-screen max-w-none text-base px-8 py-5 caret-[var(--color-ios-accent)] prose prose-p:my-3 prose-p:leading-relaxed prose-headings:my-4 prose-blockquote:my-4 prose-ul:my-2 prose-li:my-0 prose-code:px-1 prose-code:text-purple-600 prose-code:before:content-[''] prose-code:after:content-['']"
    />
  )
}
