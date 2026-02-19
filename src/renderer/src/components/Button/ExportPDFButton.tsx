import { useState } from 'react'
import { LuFileDown } from 'react-icons/lu'
import { ActionButton, ActionButtonProps } from './ActionButton'

export const ExportPDFButton = ({ ...props }: ActionButtonProps) => {
  const [exported, setExported] = useState(false)

  const handleExport = async () => {
    const success = await window.context.exportPDF()
    if (success) {
      setExported(true)
      setTimeout(() => setExported(false), 2000)
    }
  }

  return (
    <ActionButton onClick={handleExport} {...props}>
      <LuFileDown className="w-4 h-4 text-[var(--ios-accent)]" />
      <span>{exported ? 'Exported!' : 'Export PDF'}</span>
    </ActionButton>
  )
}
