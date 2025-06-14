import { createNote } from '@renderer/store'
import { useSetAtom } from 'jotai'
import { LuFileSignature } from 'react-icons/lu'
import { ActionButton, ActionButtonProps } from './ActionButton'

export const AddNote = ({ ...props }: ActionButtonProps) => {
  const createEmptyNote = useSetAtom(createNote)

  const handleCreate = async () => {
    await createEmptyNote()
  }

  return (
    <ActionButton onClick={handleCreate} {...props}>
      <LuFileSignature className="w-4 h-4 text-blue-500" />
      <span>New Note</span>
    </ActionButton>
  )
}
