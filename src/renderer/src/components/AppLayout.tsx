import { ComponentProps, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

export const RootLayout = ({ children, className, ...props }: ComponentProps<'main'>) => {
  return (
    <main
      className={twMerge('flex flex-row h-screen', className)}
      style={{ backgroundColor: 'var(--ios-bg)' }}
      {...props}
    >
      {children}
    </main>
  )
}

export const Sidebar = ({ className, children, ...props }: ComponentProps<'aside'>) => {
  return (
    <aside
      className={twMerge('w-[280px] h-screen overflow-y-auto flex flex-col shrink-0', className)}
      style={{
        backgroundColor: 'var(--ios-surface)',
        borderRight: '1px solid var(--ios-separator)'
      }}
      {...props}
    >
      {children}
    </aside>
  )
}

export const Content = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={twMerge('flex-1 h-screen overflow-y-auto flex flex-col', className)}
      style={{ backgroundColor: 'var(--ios-surface)' }}
      {...props}
    >
      {children}
    </div>
  )
)

Content.displayName = 'Content'
