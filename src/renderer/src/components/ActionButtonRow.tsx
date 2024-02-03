import { ComponentProps } from 'react'
import { AddNote, DeleteNote } from './Button'

export const ActionButtonRow = ({ ...props }: ComponentProps<'div'>) => {
  return (
    <div {...props}>
      <AddNote />
      <DeleteNote />
    </div>
  )
}
