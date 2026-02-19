import { NoteContent, NoteInfo } from '@shared/models'
import { atom } from 'jotai'
import { atomWithStorage, unwrap } from 'jotai/utils'

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

export const pinnedNotesAtom = atomWithStorage<string[]>('jotpad-pinned-notes', [])

export const filteredNotesAtom = atom((get) => {
  const notes = get(notesAtom)
  const pinned = get(pinnedNotesAtom)
  const query = get(searchQueryAtom).toLowerCase().trim()

  if (!notes) return []

  const filtered = !query ? notes : notes.filter((note) => note.title.toLowerCase().includes(query))

  return filtered.sort((a, b) => {
    const isAPinned = pinned.includes(a.title)
    const isBPinned = pinned.includes(b.title)

    if (isAPinned && !isBPinned) return -1
    if (!isAPinned && isBPinned) return 1
    return b.lastEditTime - a.lastEditTime
  })
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

  const result = await window.context.createnote()

  if (!result) return

  const newNote: NoteInfo = {
    title: result.title,
    lastEditTime: Date.now(),
    ext: result.ext
  }

  set(notesAtom, [newNote, ...notes.filter((note) => note.title !== newNote.title)])

  set(selectedNoteIndexAtom, 0)
})

export const deleteNote = atom(null, async (get, set, target?: { title: string; ext: string }) => {
  const notes = get(notesAtom)
  if (!notes) return

  // Use target if provided, otherwise fall back to selected note
  const noteToDelete = target ?? get(selectedNoteAtom)
  if (!noteToDelete) return

  const isDeleted = await window.context.trashNote(noteToDelete.title, noteToDelete.ext)

  if (!isDeleted) return

  set(
    notesAtom,
    notes.filter((note) => note.title !== noteToDelete.title)
  )

  // Clear selection if the deleted note was the selected one
  const selectedNote = get(selectedNoteAtom)
  if (selectedNote?.title === noteToDelete.title) {
    set(selectedNoteIndexAtom, null)
  }
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

export const togglePinNote = atom(null, (get, set, title: string) => {
  const pinned = get(pinnedNotesAtom)
  if (pinned.includes(title)) {
    set(
      pinnedNotesAtom,
      pinned.filter((t) => t !== title)
    )
  } else {
    set(pinnedNotesAtom, [...pinned, title])
  }
})

export const renameNote = atom(
  null,
  async (get, set, { oldTitle, newTitle }: { oldTitle: string; newTitle: string }) => {
    const notes = get(notesAtom)
    if (!notes) return

    const note = notes.find((n) => n.title === oldTitle)
    if (!note) return

    const success = await window.context.renameNote(oldTitle, newTitle, note.ext)
    if (success) {
      set(
        notesAtom,
        notes.map((n) => {
          if (n.title === oldTitle) {
            return { ...n, title: newTitle, lastEditTime: Date.now() }
          }
          return n
        })
      )

      const pinned = get(pinnedNotesAtom)
      if (pinned.includes(oldTitle)) {
        set(
          pinnedNotesAtom,
          pinned.map((t) => (t === oldTitle ? newTitle : t))
        )
      }

      const selectedNote = get(selectedNoteAtom)
      if (selectedNote?.title === oldTitle) {
        set(selectedNoteIndexAtom, 0)
      }
    }
  }
)
