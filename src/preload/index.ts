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
import { contextBridge, ipcRenderer } from 'electron'

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

try {
  contextBridge.exposeInMainWorld('context', {
    locale: navigator.language,
    getNotes: (...args: Parameters<GetNotes>) => ipcRenderer.invoke('getNotes', ...args),
    readNote: (...args: Parameters<ReadNote>) => ipcRenderer.invoke('readNote', ...args),
    writeNote: (...args: Parameters<WriteNote>) => ipcRenderer.invoke('writeNote', ...args),
    createnote: (...args: Parameters<CreateNote>) => ipcRenderer.invoke('createnote', ...args),
    deletenote: (...args: Parameters<DeleteNote>) => ipcRenderer.invoke('deletenote', ...args),
    renameNote: (...args: Parameters<RenameNote>) => ipcRenderer.invoke('renameNote', ...args),
    exportPDF: (...args: Parameters<ExportPDF>) => ipcRenderer.invoke('exportPDF', ...args),
    trashNote: (...args: Parameters<TrashNote>) => ipcRenderer.invoke('trashNote', ...args),
    getTrash: (...args: Parameters<GetTrash>) => ipcRenderer.invoke('getTrash', ...args),
    restoreNote: (...args: Parameters<RestoreNote>) => ipcRenderer.invoke('restoreNote', ...args),
    emptyTrash: (...args: Parameters<EmptyTrash>) => ipcRenderer.invoke('emptyTrash', ...args)
  })
} catch (error) {
  console.error(error)
}
