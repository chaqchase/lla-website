'use client'

import { Chevron } from '@/components/site/icons'
import type { NavSection } from '@/lib/docs-nav'
import { SECTION_GLYPHS } from '@/lib/section-glyphs'
import { cn } from '@/lib/utils'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'

export function DocsTree({ nav, instanceId = 'sidebar' }: { nav: NavSection[]; instanceId?: string }) {
  const pathname = usePathname()

  return (
    <LayoutGroup id={instanceId}>
      <nav aria-label="Documentation" className="space-y-5 text-[0.9375rem]">
        {nav.map((section) => (
          <Section key={section.key} section={section} pathname={pathname} instanceId={instanceId} />
        ))}
      </nav>
    </LayoutGroup>
  )
}

function Section({
  section,
  pathname,
  instanceId
}: {
  section: NavSection
  pathname: string | null
  instanceId: string
}) {
  const containsCurrent = section.items.some((item) => item.href === pathname)
  const [open, setOpen] = React.useState(!section.collapsible || containsCurrent)
  const reduceMotion = useReducedMotion()

  React.useEffect(() => {
    if (containsCurrent) setOpen(true)
  }, [containsCurrent])

  const glyph = (
    <span aria-hidden="true" className="w-3 text-center">
      {SECTION_GLYPHS[section.label]}
    </span>
  )

  const list = (
    <ul className="space-y-px">
      {section.items.map((item) => {
        const active = item.href === pathname
        return (
          <li key={item.href} className="relative">
            {active && (
              <motion.span
                layoutId={`${instanceId}-marker`}
                transition={reduceMotion ? { duration: 0 } : { type: 'spring', duration: 0.28, bounce: 0.08 }}
                className="absolute inset-0 rounded-md bg-secondary"
              >
                <span aria-hidden="true" className="absolute right-2.5 top-1/2 size-1 -translate-y-1/2 rounded-full bg-primary" />
              </motion.span>
            )}
            <Link
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative block rounded-md px-2.5 py-1 leading-5 transition-colors duration-150',
                active ? 'text-fg' : 'text-muted-fg hover:text-fg'
              )}
            >
              {item.title}
            </Link>
          </li>
        )
      })}
    </ul>
  )

  if (!section.collapsible) {
    return (
      <div>
        <h2 className="tag mb-1 flex items-center gap-1.5 px-2.5">
          {glyph}
          {section.label}
        </h2>
        {list}
      </div>
    )
  }

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="tag group mb-1 flex w-full items-center gap-1.5 px-2.5 transition-colors duration-150 hover:text-fg"
      >
        {glyph}
        {section.label}
        <span className="ml-auto flex items-center gap-1.5">
          <span className="tabular-nums">
            {section.items.filter((item) => !item.href.endsWith('/overview')).length}
          </span>
          <Chevron
            width={12}
            height={12}
            className={cn('transition-transform duration-200 ease-out', open && 'rotate-90')}
          />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            {list}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
