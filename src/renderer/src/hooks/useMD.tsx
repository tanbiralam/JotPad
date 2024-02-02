import { selectedNoteAtom } from '@renderer/store'
import { useAtomValue } from 'jotai'

export const useMD = () => {
  const selectedNote = useAtomValue(selectedNoteAtom)

  return {
    selectedNote
  }
}
