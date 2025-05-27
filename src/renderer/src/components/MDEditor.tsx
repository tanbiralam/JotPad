import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin
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
      plugins={[headingsPlugin(), listsPlugin(), quotePlugin(), markdownShortcutPlugin()]}
      contentEditableClassName="bg-white text-neutral-800 outline-none min-h-screen max-w-none text-lg px-6 py-4 caret-blue-500 prose prose-p:my-3 prose-p:leading-relaxed prose-headings:my-4 prose-blockquote:my-4 prose-ul:my-2 prose-li:my-0 prose-code:px-1 prose-code:text-purple-600 prose-code:before:content-[''] prose-code:after:content-['']"
    />
  )
}
