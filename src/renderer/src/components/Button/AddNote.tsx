import { ActionButton, ActionButtonProps } from './ActionButton'
import { LuFileSignature } from 'react-icons/lu'

export const AddNote = ({ ...props }: ActionButtonProps) => {
  return (
    <ActionButton {...props}>
      <LuFileSignature className="w-4 h-4 text-zinc-600" />
    </ActionButton>
  )
}
