import {
  createnote,
  deletenote,
  emptyTrash,
  getNotes,
  getTrash,
  purgeOldTrash,
  readNote,
  renameNote,
  restoreNote,
  trashNote,
  writeNote
} from '@/lib'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import {
  CreateNote,
  DeleteNote,
  EmptyTrash,
  GetNotes,
  GetTrash,
  ReadNote,
  RenameNote,
  RestoreNote,
  TrashNote,
  WriteNote
} from '@shared/types'
import { BrowserWindow, app, dialog, ipcMain, shell } from 'electron'
import { writeFile } from 'fs-extra'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    center: true,
    title: 'JotPad',
    frame: true,
    // vibrancy: 'under-window', Both are for mac os
    // trafficLightPosition: { x: 15, y: 10 },
    visualEffectState: 'inactive',
    titleBarStyle: 'default',

    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow!.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
  if (process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// Suppress GPU shader disk cache errors (Chromium cache lock conflicts during dev)
app.commandLine.appendSwitch('disable-gpu-shader-disk-cache')

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.handle('getNotes', (_, ...args: Parameters<GetNotes>) => getNotes(...args))
  ipcMain.handle('readNote', (_, ...args: Parameters<ReadNote>) => readNote(...args))
  ipcMain.handle('writeNote', (_, ...args: Parameters<WriteNote>) => writeNote(...args))
  ipcMain.handle('createnote', (_, ...args: Parameters<CreateNote>) => createnote(...args))
  ipcMain.handle('deletenote', (_, ...args: Parameters<DeleteNote>) => deletenote(...args))
  ipcMain.handle('renameNote', (_, ...args: Parameters<RenameNote>) => renameNote(...args))

  // Trash IPC handlers
  ipcMain.handle('trashNote', (_, ...args: Parameters<TrashNote>) => trashNote(...args))
  ipcMain.handle('getTrash', (_, ...args: Parameters<GetTrash>) => getTrash(...args))
  ipcMain.handle('restoreNote', (_, ...args: Parameters<RestoreNote>) => restoreNote(...args))
  ipcMain.handle('emptyTrash', (_, ...args: Parameters<EmptyTrash>) => emptyTrash(...args))

  // Auto-purge trash items older than 30 days
  purgeOldTrash().catch((err) => console.error('Purge failed:', err))

  // PDF Export handler
  ipcMain.handle('exportPDF', async () => {
    if (!mainWindow) return false

    const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
      title: 'Export as PDF',
      defaultPath: 'note.pdf',
      buttonLabel: 'Export',
      filters: [{ name: 'PDF', extensions: ['pdf'] }]
    })

    if (canceled || !filePath) return false

    try {
      const pdfData = await mainWindow.webContents.printToPDF({
        printBackground: true,
        margins: { top: 0.5, bottom: 0.5, left: 0.5, right: 0.5 }
      })

      await writeFile(filePath, pdfData)
      console.info(`PDF exported to ${filePath}`)
      return true
    } catch (error) {
      console.error('PDF export failed:', error)
      return false
    }
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
