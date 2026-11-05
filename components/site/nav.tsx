'use client'

import { Logo } from '@/components/logo'
import type { NavSection } from '@/lib/docs-nav'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import { siteConfig } from '@/config/site'
import { DocsTree } from '@/components/docs/sidebar'
import { Close, Github, Menu, Search } from './icons'
import { useOpenSearch } from './search'
import { ThemeToggle } from './theme-toggle'

const LINKS = [
  { label: 'Docs', href: '/docs/about/introduction', match: (path: string) => path.startsWith('/docs') && !path.startsWith('/docs/first-party-plugins') && !path.startsWith('/docs/plugins') },
  { label: 'Plugins', href: '/docs/first-party-plugins/overview', match: (path: string) => path.startsWith('/docs/first-party-plugins') || path.startsWith('/docs/plugins') },
  { label: 'Releases', href: siteConfig.links.releases, match: () => false }
]

const iconButton = 'pressable grid size-7 place-items-center rounded-md text-muted-fg hover:bg-secondary hover:text-fg'

export function Nav({ nav }: { nav: NavSection[] }) {
  const pathname = usePathname() ?? '/'
  const openSearch = useOpenSearch()
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [isMac, setIsMac] = React.useState(true)

  React.useEffect(() => {
    setIsMac(/mac|iphone|ipad/i.test(navigator.platform))
  }, [])

  React.useEffect(() => setMenuOpen(false), [pathname])

  React.useEffect(() => {
    if (!menuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  return (
    <>
      <header className="sticky top-0 z-40 h-[var(--nav-height)] border-b bg-background">
        {/* Lines up with the page below: the sidebar in the docs, the content column elsewhere. */}
        <div className={cn('mx-auto flex h-full items-center gap-4 px-4 sm:px-6', pathname.startsWith('/docs') ? 'max-w-8xl' : 'max-w-[68rem]')}>
          <Link href="/" aria-label="lla home" className="pressable group flex items-center gap-1.5 rounded">
            <Logo className="w-[1.0625rem] transition-transform duration-300 ease-out group-hover:-rotate-6" />
            <span className="text-base font-semibold leading-none tracking-tight">lla</span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-0.5 md:flex">
            {LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                aria-current={link.match(pathname) ? 'page' : undefined}
                className={cn(
                  'pressable flex h-7 items-center rounded-md px-2 text-[0.9375rem] hover:bg-secondary',
                  link.match(pathname) ? 'text-fg' : 'text-muted-fg hover:text-fg'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-0.5">
            <button
              type="button"
              onClick={openSearch}
              className="pressable mr-1.5 hidden h-7 w-52 items-center gap-1.5 rounded-md border bg-surface px-2 text-sm text-muted-fg hover:border-fg/15 hover:text-fg md:flex"
            >
              <Search width={13} height={13} />
              <span>Search</span>
              <kbd className="ml-auto rounded-[3px] border bg-background px-1 font-sans text-xs leading-4">{isMac ? '⌘K' : 'Ctrl K'}</kbd>
            </button>
            <button type="button" aria-label="Search" onClick={openSearch} className={cn(iconButton, 'md:hidden')}>
              <Search width={15} height={15} />
            </button>
            <a href={siteConfig.links.repo} aria-label="lla on GitHub" className={iconButton}>
              <Github width={15} height={15} />
            </a>
            <ThemeToggle />
            <button
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
              className={cn(iconButton, 'lg:hidden')}
            >
              {menuOpen ? <Close width={15} height={15} /> : <Menu width={15} height={15} />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-[var(--nav-height)] z-30 overflow-y-auto overscroll-contain bg-background px-4 pb-16 pt-4 animate-in fade-in-0 duration-150 sm:px-6 lg:hidden">
          <DocsTree nav={nav} instanceId="menu" />
        </div>
      )}
    </>
  )
}
