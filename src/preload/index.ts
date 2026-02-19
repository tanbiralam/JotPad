import {
  CreateNote,
  DeleteNote,
  ExportNote,
  GetNotes,
  ReadNote,
  RenameNote,
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
    exportNote: (...args: Parameters<ExportNote>) => ipcRenderer.invoke('exportNote', ...args)
  })
} catch (error) {
  console.error(error)
}
