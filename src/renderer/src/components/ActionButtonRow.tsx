import { ComponentProps } from 'react'
import { AddNote, DeleteNote, ExportNoteButton } from './Button'

export const ActionButtonRow = ({ ...props }: ComponentProps<'div'>) => {
  return (
    <div className={`action-buttons ${props.className || ''}`} {...props}>
      <AddNote />
      <DeleteNote />
      <ExportNoteButton />
    </div>
  )
}
