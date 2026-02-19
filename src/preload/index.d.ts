import {
  CreateNote,
  DeleteNote,
  ExportNote,
  GetNotes,
  ReadNote,
  RenameNote,
  WriteNote
} from '@shared/types'

declare global {
  interface Window {
    // electron: ElectronAPI
    context: {
      locale: string
      getNotes: GetNotes
      readNote: ReadNote
      writeNote: WriteNote
      createnote: CreateNote
      deletenote: DeleteNote
      renameNote: RenameNote
      exportNote: ExportNote
    }
  }
}
