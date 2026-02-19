import {
  BoldItalicUnderlineToggles,
  codeBlockPlugin,
  codeMirrorPlugin,
  CreateLink,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  headingsPlugin,
  InsertCodeBlock,
  InsertThematicBreak,
  jsxPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  Separator,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo
} from '@mdxeditor/editor'
import { useMD } from '@renderer/hooks/useMD'

export const MDEditor = () => {
  const { editorRef, selectedNote, handleAutoSaving, handleBlur } = useMD()

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
      plugins={[
        headingsPlugin(),
        jsxPlugin(),
        listsPlugin(),
        quotePlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            js: 'JavaScript',
            ts: 'TypeScript',
            tsx: 'TypeScript (React)',
            jsx: 'JavaScript (React)',
            css: 'CSS',
            html: 'HTML',
            json: 'JSON',
            python: 'Python',
            markdown: 'Markdown'
          }
        }),
        diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: undefined }),
        toolbarPlugin({
          toolbarContents: () => (
            <DiffSourceToggleWrapper>
              <UndoRedo />
              <Separator />
              <BoldItalicUnderlineToggles />
              <Separator />
              <ListsToggle />
              <Separator />
              <CreateLink />
              <InsertCodeBlock />
              <InsertThematicBreak />
            </DiffSourceToggleWrapper>
          )
        })
      ]}
      contentEditableClassName="outline-none min-h-screen max-w-none text-base px-8 py-5 caret-[var(--ios-accent)] prose prose-p:my-3 prose-p:leading-relaxed prose-headings:my-4 prose-blockquote:my-4 prose-ul:my-2 prose-li:my-0 prose-code:px-1 prose-code:text-purple-600 prose-code:before:content-[''] prose-code:after:content-['']"
    />
  )
}
