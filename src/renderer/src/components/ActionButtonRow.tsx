import { ComponentProps } from 'react'
import { LuTrash2 } from 'react-icons/lu'
import { ActionButton, AddNote } from './Button'

type ActionButtonRowProps = ComponentProps<'div'> & {
  onOpenTrash?: () => void
}

export const ActionButtonRow = ({ onOpenTrash, ...props }: ActionButtonRowProps) => {
  return (
    <div {...props}>
      <AddNote />
      <ActionButton onClick={onOpenTrash}>
        <LuTrash2 className="w-4 h-4" style={{ color: 'var(--ios-text-secondary)' }} />
        <span>Trash</span>
      </ActionButton>
    </div>
  )
}
