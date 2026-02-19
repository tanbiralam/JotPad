import { ActionButton, ActionButtonProps } from '@/components'
import { LuFileOutput } from 'react-icons/lu'

export const ExportNoteButton = ({ ...props }: ActionButtonProps) => {
  const handleExport = async () => {
    await window.context.exportNote()
  }

  return (
    <ActionButton onClick={handleExport} {...props} title="Export to PDF">
      <LuFileOutput className="w-4 h-4 text-zinc-300" />
    </ActionButton>
  )
}
