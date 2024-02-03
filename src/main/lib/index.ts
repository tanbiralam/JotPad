import { appDirName, fileEncoding } from '@shared/constants'
import { NoteInfo } from '@shared/models'
import { GetNotes } from '@shared/types'
import { Stats, readdir, stat } from 'fs'
import { ensureDir } from 'fs-extra'
import { homedir } from 'os'

export const getRootDir = () => {
  return `${homedir()}/${appDirName}`
}

export const getNotes: GetNotes = async () => {
  const rootDir = getRootDir()

  await ensureDir(rootDir)

  const notesFileNames = await readdir(rootDir, {
    encoding: fileEncoding //TODO: Fix these two encoding & filter issue
  })

  const notes = notesFileNames.filter((fileName) => fileName.endsWith('.md'))

  return Promise.all(notes.map(getNoteInfoFromFileName))
}

export const getNoteInfoFromFileName = async (filename: string): Promise<NoteInfo> => {
  const filePath = `${getRootDir()}/${filename}`
  const fileStats: Stats = await new Promise((resolve, reject) => {
    stat(filePath, (err, stats) => {
      if (err) reject(err)
      else resolve(stats)
    })
  })

  return {
    title: filename.replace(/\.md$/, ''),
    lastEditTime: fileStats.mtimeMs
  }
}
