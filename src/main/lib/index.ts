import { appDirName, fileEncoding, supportedExtensions } from '@shared/constants'
import { NoteInfo } from '@shared/models'
import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote } from '@shared/types'
import { dialog } from 'electron'
import { ensureDir, readFile, readdir, remove, stat, writeFile } from 'fs-extra'
import { isEmpty } from 'lodash'
import { homedir } from 'os'
import path from 'path'
import welcomeNoteFile from '../../../resources/welcomeNote.md?asset'

export const getRootDir = () => {
  return `${homedir()}\\Desktop\\${appDirName}`
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

  const { name: filename, dir: parentDir } = path.parse(filePath)

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

  return filename
}

export const deletenote: DeleteNote = async (filename, ext) => {
  const rootDir = getRootDir()

  const { response } = await dialog.showMessageBox({
    type: 'warning',
    title: 'Delete Note',
    message: `Are you sure you want to delete ${filename}`,
    buttons: ['Delete', 'Cancel'], // 0: Delete, 1: Cancel
    defaultId: 1,
    cancelId: 1
  })

  if (response === 1) {
    console.info('Note Deletion Aborted')
    return false
  }

  console.info(`Deleting Note ${filename}`)

  await remove(`${rootDir}/${filename}${ext}`)
  return true
}
