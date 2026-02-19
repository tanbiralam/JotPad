import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export type ActionButtonProps = ComponentProps<'button'>
export const ActionButton = ({ children, className, ...props }: ActionButtonProps) => {
  return (
    <button
      className={twMerge(
        'flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer',
        'bg-[var(--ios-fill)] hover:bg-[var(--ios-separator)]',
        'text-[var(--ios-text)] active:scale-[0.97]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
