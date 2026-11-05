import { renderCaption } from '@/components/docs/caption'
import { ArrowRight } from '@/components/site/icons'
import { viewGlyphs, type ViewGlyphName } from '@/components/illustrations/view-glyphs'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import type { ReactNode } from 'react'

/** A hand-drawn diagram, sharing the screenshot caption style. */
export function Diagram({ caption, children }: { caption?: ReactNode; children: ReactNode }) {
  return (
    <figure className="not-doc my-6">
      <div className="paper rounded-lg border p-3 sm:p-4">{children}</div>
      {caption && <figcaption className="mt-2 text-[0.9375rem] leading-snug text-muted-fg">{renderCaption(caption)}</figcaption>}
    </figure>
  )
}

const CALLOUTS = {
  note: { label: 'Note', glyph: '◇', color: 'text-muted-fg' },
  tip: { label: 'Tip', glyph: '✦', color: 'text-primary' },
  warning: { label: 'Careful', glyph: '▲', color: 'text-danger' }
}

export function Callout({
  type = 'note',
  title,
  children
}: {
  type?: keyof typeof CALLOUTS
  title?: string
  children: ReactNode
}) {
  const { label, glyph, color } = CALLOUTS[type]
  return (
    <aside className="my-5 rounded-md border bg-surface px-3 py-2.5 text-base [&>div>:first-child]:mt-0 [&>div>:last-child]:mb-0">
      <p className="label !mb-0.5 !mt-0 flex items-center gap-1.5">
        <span aria-hidden="true" className={cn('w-3 text-center font-mono text-[0.8125rem] leading-none', color)}>
          {glyph}
        </span>
        {title ?? label}
      </p>
      <div>{children}</div>
    </aside>
  )
}

export function Cards({ children }: { children: ReactNode }) {
  return <div className="not-doc my-5 grid gap-2 sm:grid-cols-2">{children}</div>
}

export function Card({ href, title, children }: { href: string; title: string; children?: ReactNode }) {
  return (
    <Link
      href={href}
      data-plain=""
      className="pressable group relative block rounded-md border bg-surface px-3 py-2.5 !no-underline hover:border-fg/15"
    >
      <span className="flex items-center justify-between gap-3 text-base font-medium leading-5 text-fg">
        {title}
        <ArrowRight width={13} height={13} className="shrink-0 text-muted-fg transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-fg" />
      </span>
      {children && <span className="mt-0.5 block text-[0.9375rem] leading-snug text-muted-fg">{children}</span>}
    </Link>
  )
}

const VIEWS: Array<{ name: ViewGlyphName; title: string; flag: string; anchor: string }> = [
  { name: 'default', title: 'Default', flag: 'lla', anchor: 'default-view' },
  { name: 'long', title: 'Long', flag: 'lla -l', anchor: 'long-view' },
  { name: 'tree', title: 'Tree', flag: 'lla -t', anchor: 'tree-view' },
  { name: 'table', title: 'Table', flag: 'lla -T', anchor: 'table-view' },
  { name: 'grid', title: 'Grid', flag: 'lla -g', anchor: 'grid-view' },
  { name: 'git', title: 'Git', flag: 'lla -G', anchor: 'git-view' },
  { name: 'timeline', title: 'Timeline', flag: 'lla --timeline', anchor: 'timeline-view' },
  { name: 'sizemap', title: 'Size map', flag: 'lla -S', anchor: 'size-map-view' },
  { name: 'recursive', title: 'Recursive', flag: 'lla -R', anchor: 'recursive-view' },
  { name: 'fuzzy', title: 'Fuzzy', flag: 'lla -F', anchor: 'fuzzy-view' }
]

/** Every view at a glance, each drawn as a small glyph. */
export function ViewIndex({ base = '/docs/usage/views' }: { base?: string }) {
  return (
    <ul className="not-doc my-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-3 md:grid-cols-5">
      {VIEWS.map((view) => (
        <li key={view.name} className="bg-surface">
          <Link
            data-plain=""
            href={view.name === 'fuzzy' ? '/docs/usage/navigation#fuzzy-view' : `${base}#${view.anchor}`}
            className="group block h-full p-3 !no-underline transition-colors duration-150 hover:bg-card-header"
          >
            <span className="block w-9 text-fg">{viewGlyphs[view.name]}</span>
            <span className="mt-2 block text-[0.9375rem] font-medium leading-5 text-fg">{view.title}</span>
            <span className="tag block">{view.flag}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
