import { NoteContent, NoteInfo } from '@shared/models'
import { atom } from 'jotai'
import { unwrap } from 'jotai/utils'

// ── Theme ──
export type ThemeMode = 'light' | 'dark' | 'system'
export const themeModeAtom = atom<ThemeMode>(
  (localStorage.getItem('jotpad-theme') as ThemeMode) || 'system'
)

export const resolvedThemeAtom = atom((get) => {
  const mode = get(themeModeAtom)
  if (mode !== 'system') return mode
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
})

// ── Notes ──
const loadNotes = async () => {
  const notes = await window.context.getNotes()
  return notes.sort((a, b) => b.lastEditTime - a.lastEditTime)
}

const notesAtomAsync = atom<NoteInfo[] | Promise<NoteInfo[]>>(loadNotes())

export const notesAtom = unwrap(notesAtomAsync, (prev) => prev)

export const searchQueryAtom = atom<string>('')

export const filteredNotesAtom = atom((get) => {
  const notes = get(notesAtom)
  const query = get(searchQueryAtom).toLowerCase().trim()

  if (!notes) return notes
  if (!query) return notes

  return notes.filter((note) => note.title.toLowerCase().includes(query))
})

export const selectedNoteIndexAtom = atom<number | null>(null)

const selectedNoteAtomAsync = atom(async (get) => {
  const notes = get(notesAtom)
  const selectedNoteIndex = get(selectedNoteIndexAtom)

  if (selectedNoteIndex === null || !notes) return null

  const selectedNote = notes[selectedNoteIndex]

  const noteContent = await window.context.readNote(selectedNote.title, selectedNote.ext)

  return {
    ...selectedNote,
    content: noteContent
  }
})

export const selectedNoteAtom = unwrap(selectedNoteAtomAsync, (prev) => prev) ?? {
  title: '',
  content: '',
  lastEditTime: Date.now(),
  ext: '.md'
}

export const createNote = atom(null, async (get, set) => {
  const notes = get(notesAtom)

  if (!notes) return

  const title = await window.context.createnote()

  if (!title) return

  const newNote: NoteInfo = {
    title,
    lastEditTime: Date.now(),
    ext: '.md'
  }

  set(notesAtom, [newNote, ...notes.filter((note) => note.title !== newNote.title)])

  set(selectedNoteIndexAtom, 0)
})

export const deleteNote = atom(null, async (get, set) => {
  const notes = get(notesAtom)
  const selectedNote = get(selectedNoteAtom)

  if (!selectedNote || !notes) return

  const isDeleted = await window.context.deletenote(selectedNote.title, selectedNote.ext)

  if (!isDeleted) return

  set(
    notesAtom,
    notes.filter((note) => note.title !== selectedNote.title)
  )

  set(selectedNoteIndexAtom, null)
})

export const updateNote = atom(null, async (get, set, newContent: NoteContent) => {
  const notes = get(notesAtom)
  const selectedNote = get(selectedNoteAtom)
  if (!selectedNote || !notes) return

  // File Save on Disk
  await window.context.writeNote(selectedNote.title, selectedNote.ext, newContent)

  set(
    notesAtom,
    notes.map((note) => {
      if (note.title === selectedNote.title) {
        return {
          ...note,
          lastEditTime: Date.now()
        }
      }
      return note
    })
  )
})
