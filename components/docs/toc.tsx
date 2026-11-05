'use client'

import { Chevron } from '@/components/site/icons'
import { cn } from '@/lib/utils'
import * as React from 'react'

export interface TocEntry {
  title: string
  url: string
  items?: TocEntry[]
}

function flatten(entries: TocEntry[], depth = 0): Array<{ title: string; id: string; depth: number }> {
  return entries.flatMap((entry) => [
    { title: entry.title, id: entry.url.replace(/^#/, ''), depth },
    ...flatten(entry.items ?? [], depth + 1)
  ])
}

export function Toc({ entries }: { entries: TocEntry[] }) {
  // Titles of the page itself repeat in the header, so level-one entries are unwrapped.
  const flat = React.useMemo(() => flatten(entries).filter((entry) => entry.depth <= 1), [entries])
  const [active, setActive] = React.useState<string | null>(flat[0]?.id ?? null)
  const listRef = React.useRef<HTMLUListElement>(null)
  const markerRef = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const headings = flat
      .map((entry) => document.getElementById(entry.id))
      .filter((element): element is HTMLElement => Boolean(element))
    if (headings.length === 0) return

    let frame = 0
    const update = () => {
      frame = 0
      // The active heading is the last one that has crossed a line near the top.
      const line = window.innerHeight * 0.28
      let current = headings[0].id
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= line) current = heading.id
        else break
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = headings[headings.length - 1].id
      }
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [flat])

  // The marker moves with a transform, so it never triggers layout while scrolling.
  React.useLayoutEffect(() => {
    const list = listRef.current
    const marker = markerRef.current
    if (!list || !marker) return
    const link = active ? list.querySelector<HTMLElement>(`[data-toc="${CSS.escape(active)}"]`) : null
    if (!link) {
      marker.style.opacity = '0'
      return
    }
    marker.style.opacity = '1'
    marker.style.height = `${link.offsetHeight}px`
    marker.style.transform = `translateY(${link.offsetTop}px)`
    if (list.scrollHeight > list.clientHeight) {
      link.scrollIntoView({ block: 'nearest' })
    }
  }, [active])

  if (flat.length === 0) return null

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="tag mb-2">↓ on this page</p>
      <ul ref={listRef} className="relative max-h-[calc(100vh-11rem)] overflow-y-auto border-l border-[hsl(var(--hairline))] [scrollbar-width:none]">
        <span
          ref={markerRef}
          aria-hidden="true"
          className="absolute -left-px top-0 w-px bg-primary opacity-0 transition-[transform,height] duration-200 ease-out"
        />
        {flat.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              data-toc={entry.id}
              aria-current={active === entry.id ? 'location' : undefined}
              className={cn(
                'block py-[3px] pr-1 leading-snug transition-colors duration-150',
                entry.depth === 0 ? 'pl-3' : 'pl-5',
                active === entry.id ? 'text-fg' : 'text-muted-fg hover:text-fg'
              )}
            >
              {entry.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** Below the wide layout the outline folds into a single line above the article. */
export function MobileToc({ entries }: { entries: TocEntry[] }) {
  const flat = flatten(entries).filter((entry) => entry.depth === 0)
  if (flat.length < 2) return null

  return (
    <details className="group mb-6 rounded-md border bg-surface text-[0.9375rem] xl:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-1.5 [&::-webkit-details-marker]:hidden">
        <span className="tag">↓ on this page</span>
        <Chevron width={12} height={12} className="text-muted-fg transition-transform duration-200 ease-out group-open:rotate-90" />
      </summary>
      <ul className="border-t px-3 py-1.5">
        {flat.map((entry) => (
          <li key={entry.id}>
            <a href={`#${entry.id}`} className="block py-0.5 text-muted-fg transition-colors duration-150 hover:text-fg">
              {entry.title}
            </a>
          </li>
        ))}
      </ul>
    </details>
  )
}
