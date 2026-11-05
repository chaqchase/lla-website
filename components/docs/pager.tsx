import type { NavItem } from '@/lib/docs-nav'
import Link from 'next/link'

export function Pager({ previous, next }: { previous?: NavItem; next?: NavItem }) {
  if (!previous && !next) return null

  return (
    <nav aria-label="Pagination" className="mt-6 grid gap-2 border-t pt-6 sm:grid-cols-2">
      {previous ? (
        <Link href={previous.href} className="pressable group rounded-md border bg-surface px-3 py-2 hover:border-fg/15">
          <span className="tag block">
            <span aria-hidden="true" className="inline-block transition-transform duration-200 ease-out group-hover:-translate-x-0.5">
              ←
            </span>{' '}
            previous
          </span>
          <span className="mt-0.5 block text-[0.9375rem] font-medium">{previous.title}</span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      {next && (
        <Link href={next.href} className="pressable group rounded-md border bg-surface px-3 py-2 text-right hover:border-fg/15">
          <span className="tag block">
            next{' '}
            <span aria-hidden="true" className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-0.5">
              →
            </span>
          </span>
          <span className="mt-0.5 block text-[0.9375rem] font-medium">{next.title}</span>
        </Link>
      )}
    </nav>
  )
}
