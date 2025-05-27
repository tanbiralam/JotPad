import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export type ActionButtonProps = ComponentProps<'button'>
export const ActionButton = ({ children, className, ...props }: ActionButtonProps) => {
  return (
    <button
      className={twMerge(
        'flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-100 border border-neutral-200 hover:bg-neutral-200/80 transition-colors duration-100 text-sm text-neutral-700',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
