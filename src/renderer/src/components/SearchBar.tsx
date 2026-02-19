import { searchQueryAtom } from '@renderer/store'
import { useAtom } from 'jotai'
import { ComponentProps, forwardRef } from 'react'
import { LuSearch, LuX } from 'react-icons/lu'
import { twMerge } from 'tailwind-merge'

export const SearchBar = forwardRef<HTMLInputElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => {
    const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom)

    return (
      <div className={twMerge('relative', className)} {...props}>
        <LuSearch
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          style={{ color: 'var(--ios-text-secondary)' }}
        />
        <input
          ref={ref}
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-8 py-2 rounded-xl text-sm outline-none transition-all duration-200 placeholder:text-[var(--ios-text-secondary)]"
          style={{
            backgroundColor: 'var(--ios-fill)',
            color: 'var(--ios-text)',
            border: 'none'
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = '0 0 0 2px var(--ios-accent)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full transition-colors duration-150 hover:bg-[var(--ios-separator)] cursor-pointer"
          >
            <LuX className="w-3.5 h-3.5" style={{ color: 'var(--ios-text-secondary)' }} />
          </button>
        )}
      </div>
    )
  }
)

SearchBar.displayName = 'SearchBar'
