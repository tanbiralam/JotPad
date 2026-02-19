import { resolvedThemeAtom, ThemeMode, themeModeAtom } from '@renderer/store'
import { useAtomValue, useSetAtom } from 'jotai'
import { ComponentProps } from 'react'
import { LuMonitor, LuMoon, LuSun } from 'react-icons/lu'
import { twMerge } from 'tailwind-merge'

const themeIcons = {
  light: LuSun,
  dark: LuMoon,
  system: LuMonitor
}

const nextTheme: Record<ThemeMode, ThemeMode> = {
  light: 'dark',
  dark: 'system',
  system: 'light'
}

export const ThemeToggle = ({ className, ...props }: ComponentProps<'button'>) => {
  const themeMode = useAtomValue(themeModeAtom)
  const setThemeMode = useSetAtom(themeModeAtom)
  const resolved = useAtomValue(resolvedThemeAtom)

  const Icon = themeIcons[themeMode]

  const handleToggle = () => {
    const next = nextTheme[themeMode]
    setThemeMode(next)
    localStorage.setItem('jotpad-theme', next)
  }

  return (
    <button
      onClick={handleToggle}
      className={twMerge(
        'flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 cursor-pointer',
        'hover:bg-[var(--ios-fill)] active:scale-95',
        className
      )}
      style={{ color: 'var(--ios-text-secondary)' }}
      title={`Theme: ${themeMode} (${resolved})`}
      {...props}
    >
      <Icon className="w-4 h-4" />
    </button>
  )
}
