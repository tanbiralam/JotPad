import { deleteNote } from '@renderer/store'
import { useSetAtom } from 'jotai'
import { FaRegTrashCan } from 'react-icons/fa6'
import { ActionButton, ActionButtonProps } from './ActionButton'

export const DeleteNote = ({ ...props }: ActionButtonProps) => {
  const deleteEmptyNote = useSetAtom(deleteNote)
  const handleDelete = async () => {
    await deleteEmptyNote()
  }

  return (
    <ActionButton onClick={handleDelete} {...props}>
      <FaRegTrashCan className="w-4 h-4 text-red-500" />
      <span>Delete</span>
    </ActionButton>
  )
}
