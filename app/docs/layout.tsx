import { DocsTree } from '@/components/docs/sidebar'
import { getDocsNav } from '@/lib/docs-nav'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { type ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-8xl">
      <aside className="sticky top-[var(--nav-height)] hidden h-[calc(100dvh-var(--nav-height))] w-[16rem] shrink-0 overflow-y-auto overscroll-contain py-5 pl-3.5 pr-2 [scrollbar-width:none] lg:block">
        <DocsTree nav={getDocsNav()} />
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
      <SpeedInsights />
    </div>
  )
}
