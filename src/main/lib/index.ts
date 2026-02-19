import { appDirName, fileEncoding, supportedExtensions } from '@shared/constants'
import { NoteInfo, TrashInfo } from '@shared/models'
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
import { dialog } from 'electron'
import {
  ensureDir,
  move,
  pathExists,
  readFile,
  readJSON,
  readdir,
  remove,
  rename,
  stat,
  writeFile,
  writeJSON
} from 'fs-extra'
import { isEmpty } from 'lodash'
import { homedir } from 'os'
import path from 'path'
import welcomeNoteFile from '../../../resources/welcomeNote.md?asset'

const TRASH_DIR_NAME = '.trash'
const PURGE_DAYS = 30

export const getRootDir = () => {
  return `${homedir()}\\Desktop\\${appDirName}`
}

export const getTrashDir = () => {
  return path.join(getRootDir(), TRASH_DIR_NAME)
}

export const getNotes: GetNotes = async () => {
  const rootDir = getRootDir()

  await ensureDir(rootDir)

  const notesFileNames = await readdir(rootDir, {
    encoding: fileEncoding,
    withFileTypes: false
  })

  const notes = notesFileNames.filter((fileName) =>
    supportedExtensions.some((ext) => fileName.endsWith(ext))
  )

  if (isEmpty(notes)) {
    console.info('No notes found, creating a Welcome Note')

    const welcomeNoteFilename = path.basename(welcomeNoteFile)
    const content = await readFile(welcomeNoteFile, { encoding: fileEncoding })

    await writeFile(path.join(rootDir, welcomeNoteFilename), content, { encoding: fileEncoding })

    notes.push(welcomeNoteFilename)
  }

  return Promise.all(notes.map(getNoteInfoFromFileName))
}

export const getNoteInfoFromFileName = async (filename: string): Promise<NoteInfo> => {
  const fileStats = await stat(`${getRootDir()}/${filename}`)
  const parsed = path.parse(filename)

  return {
    title: parsed.name,
    lastEditTime: fileStats.mtimeMs,
    ext: parsed.ext
  }
}

export const readNote: ReadNote = async (filename, ext) => {
  const rootDir = getRootDir()

  return readFile(`${rootDir}/${filename}${ext}`, { encoding: fileEncoding })
}

export const writeNote: WriteNote = async (filename, ext, content) => {
  const rootDir = getRootDir()
  console.info(`Writing note ${filename}${ext}`)
  return writeFile(`${rootDir}/${filename}${ext}`, content, { encoding: fileEncoding })
}

export const createnote: CreateNote = async () => {
  const rootDir = getRootDir()

  await ensureDir(rootDir)

  const { filePath, canceled } = await dialog.showSaveDialog({
    title: 'Create Note',
    defaultPath: path.join(rootDir, 'Untitled.md'),
    buttonLabel: 'Create',
    properties: ['showOverwriteConfirmation'],
    showsTagField: false,
    filters: [
      { name: 'Markdown', extensions: ['md'] },
      { name: 'Text', extensions: ['txt'] }
    ]
  })

  if (canceled || !filePath) {
    console.info('Note Creation cancelled')
    return false
  }

  const { name: filename, dir: parentDir, ext } = path.parse(filePath)

  if (parentDir !== rootDir) {
    await dialog.showMessageBox({
      type: 'error',
      title: 'Creation Failed',
      message: `All notes must be saved under ${rootDir}, Avoid using other directories!`
    })

    return false
  }

  console.log(`Creating note ${filePath}`)

  await writeFile(filePath, '')

  return { title: filename, ext }
}

export const deletenote: DeleteNote = async (filename, ext) => {
  const rootDir = getRootDir()

  console.info(`Deleting Note ${filename}`)

  await remove(`${rootDir}/${filename}${ext}`)
  return true
}

export const renameNote: RenameNote = async (oldTitle, newTitle, ext) => {
  const rootDir = getRootDir()
  const oldPath = `${rootDir}/${oldTitle}${ext}`
  const newPath = `${rootDir}/${newTitle}${ext}`

  if (await pathExists(newPath)) {
    console.warn(`Rename failed: ${newTitle} already exists`)
    return false
  }

  console.info(`Renaming note: ${oldTitle} -> ${newTitle}`)
  await rename(oldPath, newPath)
  return true
}

// ── Trash Operations ──

export const trashNote: TrashNote = async (title, ext) => {
  const rootDir = getRootDir()
  const trashDir = getTrashDir()
  const srcPath = path.join(rootDir, `${title}${ext}`)
  const destPath = path.join(trashDir, `${title}${ext}`)
  const metaPath = path.join(trashDir, `${title}${ext}.meta.json`)

  await ensureDir(trashDir)

  console.info(`Moving note to trash: ${title}${ext}`)

  try {
    await move(srcPath, destPath, { overwrite: true })
    await writeJSON(metaPath, { deletedAt: Date.now() })
    return true
  } catch (error) {
    console.error('Trash failed:', error)
    return false
  }
}

export const getTrash: GetTrash = async () => {
  const trashDir = getTrashDir()

  await ensureDir(trashDir)

  const files = await readdir(trashDir, { encoding: fileEncoding })
  const noteFiles = files.filter(
    (f) => !f.endsWith('.meta.json') && supportedExtensions.some((ext) => f.endsWith(ext))
  )

  const trashItems: TrashInfo[] = []

  for (const file of noteFiles) {
    const parsed = path.parse(file)
    const metaPath = path.join(trashDir, `${file}.meta.json`)
    const fileStats = await stat(path.join(trashDir, file))

    let deletedAt = fileStats.mtimeMs
    try {
      const meta = await readJSON(metaPath)
      deletedAt = meta.deletedAt
    } catch {
      // If meta doesn't exist, use file mod time
    }

    trashItems.push({
      title: parsed.name,
      lastEditTime: fileStats.mtimeMs,
      ext: parsed.ext,
      deletedAt
    })
  }

  return trashItems
}

export const restoreNote: RestoreNote = async (title, ext) => {
  const rootDir = getRootDir()
  const trashDir = getTrashDir()
  const srcPath = path.join(trashDir, `${title}${ext}`)
  const destPath = path.join(rootDir, `${title}${ext}`)
  const metaPath = path.join(trashDir, `${title}${ext}.meta.json`)

  console.info(`Restoring note from trash: ${title}${ext}`)

  try {
    await move(srcPath, destPath, { overwrite: false })
    await remove(metaPath).catch(() => {})
    return true
  } catch (error) {
    console.error('Restore failed:', error)
    return false
  }
}

export const emptyTrash: EmptyTrash = async () => {
  const trashDir = getTrashDir()

  console.info('Emptying trash')

  try {
    await remove(trashDir)
    await ensureDir(trashDir)
    return true
  } catch (error) {
    console.error('Empty trash failed:', error)
    return false
  }
}

export const purgeOldTrash = async () => {
  const trashDir = getTrashDir()

  await ensureDir(trashDir)

  const files = await readdir(trashDir, { encoding: fileEncoding })
  const noteFiles = files.filter(
    (f) => !f.endsWith('.meta.json') && supportedExtensions.some((ext) => f.endsWith(ext))
  )

  const cutoff = Date.now() - PURGE_DAYS * 24 * 60 * 60 * 1000

  for (const file of noteFiles) {
    const metaPath = path.join(trashDir, `${file}.meta.json`)
    let deletedAt: number

    try {
      const meta = await readJSON(metaPath)
      deletedAt = meta.deletedAt
    } catch {
      const fileStats = await stat(path.join(trashDir, file))
      deletedAt = fileStats.mtimeMs
    }

    if (deletedAt < cutoff) {
      console.info(`Purging old trash item: ${file}`)
      await remove(path.join(trashDir, file))
      await remove(metaPath).catch(() => {})
    }
  }
}
