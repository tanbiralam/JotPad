import {
  CreateNote,
  DeleteNote,
  EmptyTrash,
  ExportPDF,
  GetNotes,
  GetTrash,
  ReadNote,
  RenameNote,
  RestoreNote,
  TrashNote,
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
      exportPDF: ExportPDF
      trashNote: TrashNote
      getTrash: GetTrash
      restoreNote: RestoreNote
      emptyTrash: EmptyTrash
    }
  }
}
