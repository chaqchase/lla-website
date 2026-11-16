'use client'

import { ArrowRight } from '@/components/site/icons'
import { Dither } from '@/components/site/dither'
import { shots, type ShotName } from '@/lib/shots'
import { cn } from '@/lib/utils'
import { LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

const VIEWS: Array<{ id: ShotName; glyph: string; flag: string; name: string; line: string; href: string }> = [
  { id: 'view-long', glyph: '≡', flag: '-l', name: 'Long', line: 'Permissions, sizes, dates and owners, with every column configurable.', href: '/docs/usage/views#long-view' },
  { id: 'view-tree', glyph: '⊢', flag: '-t', name: 'Tree', line: 'The shape of a project, to whatever depth you ask for.', href: '/docs/usage/views#tree-view' },
  { id: 'view-git', glyph: '±', flag: '-G', name: 'Git', line: 'Status, last commit, age and author for each entry.', href: '/docs/usage/views#git-view' },
  { id: 'view-timeline', glyph: '◷', flag: '--timeline', name: 'Timeline', line: 'Entries grouped by when they last changed, newest first.', href: '/docs/usage/views#timeline-view' },
  { id: 'view-sizemap', glyph: '◧', flag: '-S', name: 'Size map', line: 'What is taking up the room, drawn to scale.', href: '/docs/usage/views#size-map-view' },
  { id: 'view-table', glyph: '⊞', flag: '-T', name: 'Table', line: 'Bordered columns for lining entries up and comparing them.', href: '/docs/usage/views#table-view' },
  { id: 'view-grid', glyph: '▦', flag: '-g', name: 'Grid', line: 'Many short names, packed to the width of your terminal.', href: '/docs/usage/views#grid-view' },
  { id: 'view-recursive', glyph: '↳', flag: '-R', name: 'Recursive', line: 'Walk nested directories as one flat, sectioned listing.', href: '/docs/usage/views#recursive-view' },
  { id: 'view-fuzzy', glyph: '≈', flag: '-F', name: 'Fuzzy', line: 'Type a few letters, preview what matches, and act on it.', href: '/docs/usage/navigation#fuzzy-view' }
]

const ADVANCE_MS = 5200
// The frame fits the tallest view, so switching never moves the page.
const FRAME_RATIO = Math.min(...VIEWS.map((view) => shots[view.id].w / shots[view.id].h))
const pad = (value: number) => String(value).padStart(2, '0')

export function ViewSwitcher() {
  const [index, setIndex] = React.useState(0)
  const [interacted, setInteracted] = React.useState(false)
  const [hovering, setHovering] = React.useState(false)
  const [loadRest, setLoadRest] = React.useState(false)
  const [inView, setInView] = React.useState(true)
  const reduceMotion = useReducedMotion()
  const rootRef = React.useRef<HTMLDivElement>(null)
  const tabsRef = React.useRef<Array<HTMLButtonElement | null>>([])
  const view = VIEWS[index]
  const autoplay = !interacted && !reduceMotion && !hovering && inView

  // The first frame is the only one that competes for the initial paint.
  React.useEffect(() => {
    const load = () => setLoadRest(true)
    const id = 'requestIdleCallback' in window ? window.requestIdleCallback(load) : window.setTimeout(load, 400)
    return () => {
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(id as number)
      else clearTimeout(id as number)
    }
  }, [])

  React.useEffect(() => {
    const element = rootRef.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    if (!autoplay) return
    const timer = window.setTimeout(() => setIndex((value) => (value + 1) % VIEWS.length), ADVANCE_MS)
    return () => clearTimeout(timer)
  }, [autoplay, index])

  const select = (next: number, focus = false) => {
    setInteracted(true)
    setIndex(next)
    if (focus) tabsRef.current[next]?.focus()
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight') select((index + 1) % VIEWS.length, true)
    else if (event.key === 'ArrowLeft') select((index - 1 + VIEWS.length) % VIEWS.length, true)
    else return
    event.preventDefault()
  }

  return (
    <div
      ref={rootRef}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="overflow-hidden rounded-lg border bg-surface"
    >
      <div className="flex items-center gap-1.5 border-b pl-1 pr-1 sm:pr-3">
        <LayoutGroup id="view-switcher">
          <div
            role="tablist"
            aria-label="lla views"
            onKeyDown={onKeyDown}
            className="flex min-w-0 flex-1 items-center gap-px overflow-x-auto py-1 [scrollbar-width:none]"
          >
            {VIEWS.map((item, itemIndex) => {
              const selected = itemIndex === index
              return (
                <button
                  key={item.id}
                  ref={(node) => {
                    tabsRef.current[itemIndex] = node
                  }}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls="view-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(itemIndex)}
                  className={cn(
                    'pressable relative flex h-7 shrink-0 items-center gap-1.5 rounded-md px-2 text-sm',
                    selected ? 'text-fg' : 'text-muted-fg hover:text-fg'
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId="view-pill"
                      transition={reduceMotion ? { duration: 0 } : { type: 'spring', duration: 0.3, bounce: 0.08 }}
                      className="absolute inset-0 overflow-hidden rounded-md bg-secondary"
                    >
                      {autoplay && (
                        <span
                          key={index}
                          aria-hidden="true"
                          className="absolute bottom-0 left-0 h-px w-full origin-left bg-primary"
                          style={{ animation: `view-progress ${ADVANCE_MS}ms linear both` }}
                        />
                      )}
                    </motion.span>
                  )}
                  <span aria-hidden="true" className={cn('relative w-3 text-center font-mono leading-none transition-colors duration-150', selected && 'text-primary')}>
                    {item.glyph}
                  </span>
                  <span className="relative">{item.name}</span>
                </button>
              )
            })}
          </div>
        </LayoutGroup>
        <span className="tag hidden shrink-0 tabular-nums sm:block">
          {pad(index + 1)}/{pad(VIEWS.length)}
        </span>
      </div>

      {/* Windows sit on a wallpaper at their real size, with the sun coming up behind them. */}
      <div className="relative overflow-hidden bg-background">
        <Dither pattern="sun" cell={3} className="text-fg/[0.12]" />
        <div id="view-panel" role="tabpanel" aria-label={`${view.name} view`} className="relative overflow-x-auto px-4 pb-4 pt-10 [scrollbar-width:none] sm:overflow-visible sm:px-8 sm:pb-8 sm:pt-14">
          <div className="relative min-w-[640px] sm:min-w-0" style={{ aspectRatio: FRAME_RATIO }}>
            {VIEWS.map((item, itemIndex) => {
              if (itemIndex !== 0 && !loadRest) return null
              const selected = itemIndex === index
              const { w, h } = shots[item.id]
              return (
                <Image
                  key={item.id}
                  src={`/shots/${item.id}.png`}
                  alt={`The ${item.name} view of lla in a Rex terminal window`}
                  width={w}
                  height={h}
                  sizes="(max-width: 640px) 640px, (max-width: 1208px) 88vw, 1060px"
                  quality={90}
                  priority={itemIndex === 0}
                  draggable={false}
                  aria-hidden={!selected}
                  className={cn(
                    'window-shadow absolute left-0 top-0 block w-full rounded-[10px] bg-terminal transition-[opacity,filter] duration-300 ease-out',
                    selected ? 'opacity-100 blur-0' : 'pointer-events-none opacity-0 blur-[3px]'
                  )}
                />
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 border-t px-3 py-2 text-[0.9375rem] sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
        <p key={view.id} className="min-w-0 text-muted-fg animate-in fade-in-0 duration-300">
          <code className="mr-2 font-mono text-sm text-fg">lla {view.flag}</code>
          {view.line}
        </p>
        <Link href={view.href} className="group inline-flex shrink-0 items-center gap-1 font-medium">
          Learn more
          <ArrowRight width={13} height={13} className="transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  )
}
