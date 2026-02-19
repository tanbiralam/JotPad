import { deleteNote, selectedNoteAtom } from '@renderer/store'
import { useAtomValue, useSetAtom } from 'jotai'
import { useState } from 'react'
import { FaRegTrashCan } from 'react-icons/fa6'
import { DeleteConfirmModal } from '../DeleteConfirmModal'
import { ActionButton, ActionButtonProps } from './ActionButton'

export const DeleteNote = ({ ...props }: ActionButtonProps) => {
  const deleteEmptyNote = useSetAtom(deleteNote)
  const selectedNote = useAtomValue(selectedNoteAtom)
  const [showModal, setShowModal] = useState(false)

  const handleDelete = async () => {
    await deleteEmptyNote()
    setShowModal(false)
  }

  return (
    <>
      <ActionButton onClick={() => setShowModal(true)} {...props}>
        <FaRegTrashCan className="w-4 h-4 text-red-500" />
        <span>Delete</span>
      </ActionButton>
      <DeleteConfirmModal
        isOpen={showModal}
        noteTitle={selectedNote?.title}
        onCancel={() => setShowModal(false)}
        onConfirm={handleDelete}
      />
    </>
  )
}
