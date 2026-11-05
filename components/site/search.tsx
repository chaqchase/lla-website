'use client'

import type { NavSection } from '@/lib/docs-nav'
import { cn } from '@/lib/utils'
import { Command } from 'cmdk'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { createPortal } from 'react-dom'
import { ArrowRight, Search as SearchIcon } from './icons'

const SearchContext = React.createContext<() => void>(() => {})

export const useOpenSearch = () => React.useContext(SearchContext)

type SearchModule = typeof import('@/lib/search')

/**
 * The palette opens instantly and has no animation: it is a keyboard action people
 * repeat all day, and anything between the shortcut and the input only slows them down.
 */
export function SearchProvider({ nav, children }: { nav: NavSection[]; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const openSearch = React.useCallback(() => setOpen(true), [])

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <SearchContext.Provider value={openSearch}>
      {children}
      {open && <Palette nav={nav} onClose={() => setOpen(false)} />}
    </SearchContext.Provider>
  )
}

function Palette({ nav, onClose }: { nav: NavSection[]; onClose: () => void }) {
  const router = useRouter()
  const [query, setQuery] = React.useState('')
  const [engine, setEngine] = React.useState<SearchModule | null>(null)
  const [failed, setFailed] = React.useState(false)

  React.useEffect(() => {
    let active = true
    import('@/lib/search')
      .then(async (module) => {
        await module.loadSearchIndex()
        if (active) setEngine(module)
      })
      .catch(() => active && setFailed(true))
    return () => {
      active = false
    }
  }, [])

  React.useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  const go = (href: string) => {
    onClose()
    router.push(href)
  }

  const trimmed = query.trim()
  const searching = trimmed.length >= 2
  const results = React.useMemo(() => (engine && searching ? engine.searchDocs(trimmed) : []), [engine, searching, trimmed])

  return createPortal(
    <div className="fixed inset-0 z-50" role="presentation">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] dark:bg-black/60" onClick={onClose} />
      <div className="absolute inset-x-3 top-[10vh] mx-auto max-w-xl sm:inset-x-6">
        <Command
          label="Search documentation"
          shouldFilter={false}
          loop
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault()
              onClose()
            }
          }}
          className="overflow-hidden rounded-lg border bg-popover shadow-2xl ring-1 ring-black/5 dark:ring-white/5"
        >
          <div className="flex items-center gap-2 border-b px-3">
            <SearchIcon width={14} height={14} className="shrink-0 text-muted-fg" />
            <Command.Input
              autoFocus
              value={query}
              onValueChange={setQuery}
              placeholder="Search the docs"
              className="h-10 w-full bg-transparent text-base outline-none placeholder:text-muted-fg focus-visible:outline-none"
            />
            <button
              type="button"
              onClick={onClose}
              className="pressable shrink-0 rounded-[3px] border px-1.5 py-0.5 font-mono text-xs text-muted-fg hover:text-fg"
            >
              esc
            </button>
          </div>
          <Command.List className="max-h-[min(60vh,26rem)] scroll-py-2 overflow-y-auto overscroll-contain p-1.5 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[0.8125rem] [&_[cmdk-group-heading]]:text-muted-fg [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-2">
            {searching ? (
              results.length > 0 ? (
                results.map((result) => (
                  <Row
                    key={result.id}
                    value={result.id}
                    onSelect={() => go(result.sectionSlug ? `/${result.slug}#${result.sectionSlug}` : `/${result.slug}`)}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[0.9375rem] font-medium">
                        {result.title}
                        {result.section && <span className="font-normal text-muted-fg"> / {result.section}</span>}
                      </div>
                      {engine && result.content && (
                        <div
                          className="mt-0.5 line-clamp-2 text-sm leading-snug text-muted-fg [&_mark]:bg-transparent [&_mark]:font-medium [&_mark]:text-[hsl(var(--link))]"
                          dangerouslySetInnerHTML={{ __html: engine.highlightedSnippet(result.content, trimmed) }}
                        />
                      )}
                    </div>
                  </Row>
                ))
              ) : (
                <p className="px-2.5 py-8 text-center text-sm text-muted-fg">
                  {failed ? 'Search could not load. Check your connection and try again.' : engine ? `Nothing in the docs matches “${trimmed}”.` : 'Loading the index…'}
                </p>
              )
            ) : (
              nav
                .filter((section) => !section.collapsible)
                .map((section) => (
                  <Command.Group key={section.key} heading={section.label}>
                    {section.items.map((item) => (
                      <Row key={item.href} value={item.href} onSelect={() => go(item.href)}>
                        <span className="truncate text-[0.9375rem]">{item.title}</span>
                      </Row>
                    ))}
                  </Command.Group>
                ))
            )}
          </Command.List>
          <div aria-hidden="true" className="tag flex items-center gap-3 border-t px-3 py-1.5">
            <span>↑↓ move</span>
            <span>↵ open</span>
          </div>
        </Command>
      </div>
    </div>,
    document.body
  )
}

function Row({ children, value, onSelect }: { children: React.ReactNode; value: string; onSelect: () => void }) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className={cn(
        'group flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 text-fg',
        'data-[selected=true]:bg-secondary'
      )}
    >
      {children}
      <ArrowRight width={13} height={13} className="shrink-0 text-muted-fg opacity-0 group-data-[selected=true]:opacity-100" />
    </Command.Item>
  )
}
