'use client'

import { docs } from '@/.velite'
import type { Doc, HierarchyNode } from '@/components/aside'
import { createHierarchy } from '@/components/aside'
import { getHighlightedSnippet, searchDocs, type SearchResult } from '@/lib/search'
import { goodTitle } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import {
  Badge,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandModal,
  CommandSection,
  useMediaQuery
} from 'ui'

export interface OpenCloseProps {
  open: boolean
  setOpen?: (isOpen: boolean) => void
}

export function CommandPalette({ open, setOpen }: OpenCloseProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [query, setQuery] = React.useState('')
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([])

  // Close modal handler
  const closeModal = React.useCallback(() => {
    if (setOpen) {
      setOpen(false)
      setQuery('')
      setSearchResults([])
    }
  }, [setOpen])

  // Handle CMD+K / CTRL+K
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        // @ts-ignore
        setOpen((open: boolean) => !open)
      }
    }

    document.addEventListener('keydown', down)

    return () => document.removeEventListener('keydown', down)
  }, [setOpen])

  // Close modal on hash changes (for same-page section navigation)
  React.useEffect(() => {
    if (!open) return

    const handleHashChange = () => {
      closeModal()
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [open, closeModal])

  // Perform search when query changes
  React.useEffect(() => {
    if (query && query.trim().length >= 2) {
      const results = searchDocs(query, 15)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [query])

  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const data = createHierarchy(docs)
  const filteredNodeEntries = Object.entries(data).sort(([a], [b]) => {
    const order: string[] = []
    return order.indexOf(a) - order.indexOf(b)
  })

  const showSearchResults = query.trim().length >= 2 && searchResults.length > 0
  const showEmptySearch = query.trim().length >= 2 && searchResults.length === 0

  return (
    <CommandModal isOpen={open} onOpenChange={setOpen} isDismissable={true}>
      <CommandInput
        autoFocus={isDesktop}
        placeholder="Search documentation..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {showEmptySearch && <CommandEmpty>No results found for &quot;{query}&quot;</CommandEmpty>}

        {/* Show search results when user is typing */}
        {showSearchResults && (
          <CommandSection heading="Search Results">
            {searchResults.map((result) => (
              <CommandItem
                key={result.id}
                value={result.id}
                onSelect={() => {
                  const anchor =
                    result.sectionSlug ??
                    (result.section ? result.section.toLowerCase().replace(/\s+/g, '-') : undefined)
                  const url = anchor ? `/${result.slug}#${anchor}` : `/${result.slug}`
                  closeModal()
                  router.push(url)
                }}
                className="flex flex-col items-start gap-1 px-4 py-3"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="font-medium text-sm">
                    {result.title}
                    {result.section && <span className="text-muted-fg ml-1">› {result.section}</span>}
                  </div>
                </div>
                {result.content && (
                  <div
                    className="text-xs text-muted-fg line-clamp-2"
                    dangerouslySetInnerHTML={{
                      __html: getHighlightedSnippet(result.content, query, 120).replace(
                        /<mark>/g,
                        '<mark class="bg-primary/20 text-fg font-medium rounded px-0.5">'
                      )
                    }}
                  />
                )}
              </CommandItem>
            ))}
          </CommandSection>
        )}

        {/* Show browse structure when not searching */}
        {!showSearchResults &&
          query.trim().length < 2 &&
          filteredNodeEntries.map(([key, value]) => (
            <React.Fragment key={key}>
              <CommandSection key={`${key}-section`} heading={goodTitle(key)}>
                {Object.entries(value as HierarchyNode).map(([subKey, subValue]) =>
                  typeof subValue === 'object' && 'title' in subValue ? (
                    <CommandItem
                      value={goodTitle(key + ' ' + (subValue as Doc).title)}
                      className="pl-[2rem]"
                      key={`${key}-${subKey}`}
                      onSelect={() => {
                        closeModal()
                        router.push(`/${subValue.slug}`)
                      }}
                    >
                      {goodTitle((subValue as Doc).title)}
                    </CommandItem>
                  ) : null
                )}
              </CommandSection>
              {Object.entries(value as HierarchyNode).map(([subKey, subValue]) =>
                typeof subValue === 'object' && 'title' in subValue ? null : (
                  <CommandSection
                    key={`${key}-${subKey}-section`}
                    value={goodTitle(subKey)}
                    heading={goodTitle(subKey)}
                  >
                    {Object.entries(subValue as HierarchyNode).map(([childKey, childValue]) =>
                      typeof childValue === 'object' && 'title' in childValue ? (
                        <CommandItem
                          className="justify-between"
                          value={goodTitle(subKey + ' ' + (childValue as Doc).title)}
                          key={`${key}-${subKey}-${childKey}`}
                          onSelect={() => {
                            closeModal()
                            router.push(`/${childValue.slug}`)
                          }}
                        >
                          {goodTitle((childValue as Doc).title)}
                          {childValue.status && (
                            <Badge
                              intent={
                                childValue?.status === 'wip'
                                  ? 'primary'
                                  : childValue.status === 'beta'
                                    ? 'warning'
                                    : childValue.status === 'help'
                                      ? 'warning'
                                      : childValue.status === 'new'
                                        ? 'success'
                                        : 'info'
                              }
                              className="lowercase -mr-1 text-xs"
                            >
                              {childValue?.status as Doc['status']}
                            </Badge>
                          )}
                        </CommandItem>
                      ) : null
                    )}
                  </CommandSection>
                )
              )}
            </React.Fragment>
          ))}
      </CommandList>
    </CommandModal>
  )
}
