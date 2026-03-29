import { filteredNotesAtom, selectedNoteTitleAtom } from '@renderer/store'
import { useAtom, useAtomValue } from 'jotai'

export const useNotesList = ({ onSelect }: { onSelect?: () => void }) => {
  const notes = useAtomValue(filteredNotesAtom)
  const [selected, setSelected] = useAtom(selectedNoteTitleAtom)

  // Derive the visual index from the title — immune to re-sorting
  const selectedNoteIndex = notes ? notes.findIndex((n) => n.title === selected?.title) : -1

  const handleNoteSelect = (index: number) => async () => {
    const note = notes?.[index]
    if (note) {
      setSelected({ title: note.title, ext: note.ext })
    }

    if (onSelect) {
      onSelect()
    }
  }

  return {
    notes,
    selectedNoteIndex,
    handleNoteSelect
  }
}
