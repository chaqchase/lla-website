'use client'

import { Logo } from '@/components/logo'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Dither } from './dither'

const GROUPS = [
  {
    title: 'Docs',
    links: [
      { label: 'Introduction', href: '/docs/about/introduction' },
      { label: 'Installation', href: '/docs/about/installation' },
      { label: 'Views', href: '/docs/usage/views' },
      { label: 'CLI reference', href: '/docs/reference/cli-reference' }
    ]
  },
  {
    title: 'Plugins',
    links: [
      { label: 'Catalog', href: '/docs/first-party-plugins/overview' },
      { label: 'Install and manage', href: '/docs/plugins/overview' },
      { label: 'Write your own', href: '/docs/guides/plugin-development-tutorial' },
      { label: 'Manifest', href: '/docs/plugins/manifest' }
    ]
  },
  {
    title: 'Project',
    links: [
      { label: 'Source', href: siteConfig.links.repo },
      { label: 'Releases', href: siteConfig.links.releases },
      { label: 'Contributing', href: '/docs/support/contributing' },
      { label: 'Troubleshooting', href: '/docs/support/troubleshooting' }
    ]
  }
]

export function Footer() {
  const pathname = usePathname() ?? '/'

  return (
    <footer>
      <div aria-hidden="true" className="relative h-10 overflow-hidden">
        <Dither pattern="floor" cell={3} className="text-fg/[0.12]" />
      </div>
      <div className="border-t">
        <div className={cn('mx-auto grid gap-8 px-4 py-8 sm:px-6 md:grid-cols-[1fr_auto]', pathname.startsWith('/docs') ? 'max-w-8xl' : 'max-w-[68rem]')}>
          <div>
            <Link href="/" aria-label="lla home" className="pressable group flex w-fit items-center gap-1.5 rounded">
              <Logo className="w-[1.0625rem] transition-transform duration-300 ease-out group-hover:-rotate-6" />
              <span className="text-base font-semibold leading-none tracking-tight">lla</span>
            </Link>
            <p className="mt-2.5 max-w-xs text-[0.9375rem] leading-relaxed text-muted-fg">
              Open source under the MIT license. Built by{' '}
              <a href={siteConfig.links.personalSite} className="text-link">
                {siteConfig.author}
              </a>{' '}
              and contributors.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-[0.9375rem] sm:grid-cols-3">
            {GROUPS.map((group) => (
              <div key={group.title}>
                <h2 className="tag">{group.title}</h2>
                <ul className="mt-2 space-y-1">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="transition-colors duration-150 hover:text-primary">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
