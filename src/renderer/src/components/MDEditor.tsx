import {
  BoldItalicUnderlineToggles,
  CreateLink,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  Separator,
  UndoRedo,
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
import { resolvedThemeAtom } from '@renderer/store'
import { useAtomValue } from 'jotai'

export const MDEditor = () => {
  const { editorRef, selectedNote, handleAutoSaving, handleBlur } = useMD()
  const resolvedTheme = useAtomValue(resolvedThemeAtom)

  if (!selectedNote) return null

  // Plain text editor for .txt files
  if (selectedNote.ext === '.txt') {
    return (
      <textarea
        key={selectedNote.title}
        defaultValue={selectedNote.content}
        onChange={(e) => handleAutoSaving(e.target.value)}
        onBlur={(e) => {
          handleAutoSaving.cancel()
          handleAutoSaving(e.target.value)
        }}
        className="flex-1 w-full outline-none resize-none px-8 py-5 text-base leading-relaxed"
        style={{
          backgroundColor: 'var(--ios-surface)',
          color: 'var(--ios-text)',
          caretColor: 'var(--ios-accent)',
          fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace"
        }}
        placeholder="Start typing..."
        spellCheck={false}
      />
    )
  }

  // Markdown editor with toolbar for .md files
  return (
    <MDXEditor
      ref={editorRef}
      key={selectedNote.title}
      markdown={selectedNote.content}
      onChange={handleAutoSaving}
      onBlur={handleBlur}
      className={resolvedTheme === 'dark' ? 'dark-theme' : ''}
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
              <UndoRedo />
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
      contentEditableClassName="outline-none min-h-screen max-w-none text-base px-8 py-5 caret-[var(--ios-accent)] prose prose-p:my-3 prose-p:leading-relaxed prose-headings:my-4 prose-blockquote:my-4 prose-ul:my-2 prose-li:my-0 prose-code:px-1 prose-code:text-purple-600 prose-code:before:content-[''] prose-code:after:content-['']"
    />
  )
}
