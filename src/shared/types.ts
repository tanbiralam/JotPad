import { NoteContent, NoteInfo } from './models'

export type GetNotes = () => Promise<NoteInfo[]>
export type ReadNote = (title: NoteInfo['title'], ext: NoteInfo['ext']) => Promise<NoteContent>
export type WriteNote = (
  title: NoteInfo['title'],
  ext: NoteInfo['ext'],
  content: NoteContent
) => Promise<void>
export type CreateNote = () => Promise<{ title: NoteInfo['title']; ext: NoteInfo['ext'] } | false>
export type DeleteNote = (title: NoteInfo['title'], ext: NoteInfo['ext']) => Promise<boolean>
export type RenameNote = (
  oldTitle: NoteInfo['title'],
  newTitle: NoteInfo['title'],
  ext: NoteInfo['ext']
) => Promise<boolean>
