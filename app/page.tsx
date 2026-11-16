import { InstallTabs } from '@/components/home/install-tabs'
import { PluginExplorer } from '@/components/home/plugin-explorer'
import { ViewSwitcher } from '@/components/home/view-switcher'
import { Dither, type WallpaperName } from '@/components/site/dither'
import { ArrowRight } from '@/components/site/icons'
import { Reveal } from '@/components/site/reveal'
import { siteConfig } from '@/config/site'
import { shots, type ShotName } from '@/lib/shots'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  alternates: { canonical: '/' }
}

const FEATURES: Array<{
  glyph: string
  title: string
  line: string
  href: string
  shot: ShotName
  alt: string
  span: string
  wallpaper: WallpaperName
  /** Pin the window's right edge instead of its left, to show that side of a wide shot. */
  anchor?: 'right'
}> = [
  {
    glyph: '±',
    title: 'Git status in the listing',
    line: 'Each entry’s status, last commit, age and author, under a header with the branch and its upstream.',
    href: '/docs/usage/views#git-view',
    shot: 'view-git',
    alt: 'The Git view of lla listing status, commit, subject, time and author for each entry.',
    span: 'lg:col-span-7',
    wallpaper: 'rings'
  },
  {
    glyph: '◎',
    title: 'Search by name or contents',
    line: 'Filter by pattern, size, date or type, or search file contents with ripgrep.',
    href: '/docs/usage/filtering-search',
    shot: 'search',
    alt: 'lla searching file contents with ripgrep, showing highlighted matches with surrounding lines.',
    span: 'lg:col-span-5',
    wallpaper: 'contour'
  },
  {
    glyph: '⇄',
    title: 'Compare two paths',
    line: 'Diff directories, or a path against any Git reference, with size changes per entry.',
    href: '/docs/usage/views#compare-files-and-directories',
    shot: 'diff-dir',
    alt: 'lla diff comparing a directory against HEAD, summarizing added and changed files with size deltas.',
    span: 'lg:col-span-5',
    wallpaper: 'crate'
  },
  {
    glyph: '{}',
    title: 'Output for scripts',
    line: 'The same selection as JSON, NDJSON or CSV, with stable fields and typed plugin data.',
    href: '/docs/usage/machine-output',
    shot: 'json-jq',
    alt: 'lla piping JSON into jq to print the ten largest entries with their sizes.',
    span: 'lg:col-span-7',
    wallpaper: 'ramp'
  },
  {
    glyph: '◐',
    title: 'Free up disk space',
    line: 'See what fills the disk, what is safe to remove, and move it to the trash from one screen.',
    href: '/docs/usage/disk-scan',
    shot: 'scan',
    alt: 'lla scan showing a dot map of the disk and categories such as Developer, Caches and Downloads with their sizes.',
    span: 'lg:col-span-5',
    wallpaper: 'sun'
  },
  {
    glyph: '≈',
    title: 'Find files as you type',
    line: 'Fuzzy search across millions of files, with a preview of code, tables, archives and images.',
    href: '/docs/usage/navigation#fuzzy-view',
    shot: 'view-fuzzy',
    alt: 'The fuzzy finder with ranked results on the left and a syntax-highlighted preview of the selected file on the right.',
    span: 'lg:col-span-7',
    wallpaper: 'floor',
    anchor: 'right'
  }
]

const container = 'mx-auto max-w-[68rem] px-4 sm:px-6'

/** A feature as a whole link. Its window sits on a wallpaper and lifts a little on hover. */
function Feature({ glyph, title, line, href, shot, alt, span, wallpaper, anchor }: (typeof FEATURES)[number]) {
  const { w, h } = shots[shot]
  // Shots are 2120px wide unless the terminal had to be wider; keep the text the same size in every card.
  const width = Math.round((760 * w) / 2120)
  return (
    <Link
      href={href}
      className={cn(
        'group flex flex-col overflow-hidden bg-surface transition-colors duration-200 hover:bg-card-header',
        span
      )}
    >
      <div className="flex gap-2.5 p-3.5">
        <span
          aria-hidden="true"
          className="keycap transition-colors duration-200 group-hover:border-primary/50 group-hover:text-primary"
        >
          {glyph}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-medium leading-6 tracking-[-0.005em]">{title}</h3>
            <ArrowRight
              width={13}
              height={13}
              className="shrink-0 text-muted-fg transition-[transform,color] duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-fg"
            />
          </div>
          <p className="mt-1 max-w-md text-[0.9375rem] leading-[1.45] text-muted-fg [text-wrap:pretty]">{line}</p>
        </div>
      </div>
      <div className="relative mt-auto h-56 overflow-hidden border-t bg-background sm:h-60">
        <Dither pattern={wallpaper} seed={h} className="text-fg/[0.12]" />
        <Image
          src={`/shots/${shot}.png`}
          alt={alt}
          width={w}
          height={h}
          sizes={`${width}px`}
          quality={90}
          draggable={false}
          style={{ width }}
          className={cn(
            'absolute top-8 max-w-none ring-1 ring-fg/[0.06] transition-transform duration-500 ease-out [@media(hover:hover)]:group-hover:-translate-y-1',
            anchor === 'right' ? 'right-8 rounded-tr-md' : 'left-8 rounded-tl-md'
          )}
        />
      </div>
    </Link>
  )
}

export default function HomePage() {
  return (
    <div className="overflow-x-clip">
      {/* Hero */}
      <section className="relative">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 hidden h-[28rem] overflow-hidden sm:block">
          <Dither pattern="wings" cell={3} interactive className="text-fg/10" />
        </div>
        <div className={cn(container, 'relative pt-12 sm:pt-20')}>
          <div className="hero-stagger text-center">
            <a
              href={siteConfig.links.releases}
              className="pressable inline-flex h-6 items-center gap-1.5 rounded-md border bg-background px-2 font-mono text-[0.8125rem] text-muted-fg hover:border-fg/15 hover:text-fg"
            >
              <span className="led size-1.5 rounded-full bg-primary" />v{siteConfig.version}{' '}
              <span aria-hidden="true">↗&#xFE0E;</span>
            </a>
            <h1 className="display mx-auto mt-4 max-w-3xl text-[2.5rem] leading-[1.05] [text-wrap:balance] sm:text-[3.25rem] lg:text-[3.75rem]">
              A better view of every directory.
            </h1>
            <p className="mx-auto mt-3.5 max-w-2xl text-[1.0625rem] leading-relaxed text-muted-fg [text-wrap:balance] sm:text-lg">
              lla lists directories the way <code className="font-mono text-[0.9em] text-fg">ls</code> does, then adds
              trees, timelines, size maps, Git status and a disk cleaner. It’s one Rust binary with nothing to
              configure.
            </p>
          </div>

          {/* Wide enough to show the whole install script, so nobody pipes an ellipsis into bash. */}
          <div className="hero-stagger mx-auto mt-5 flex max-w-[63rem] flex-col gap-2 [--stagger:70ms] sm:flex-row">
            <InstallTabs className="min-w-0 flex-1" />
            <Link href="/docs/about/introduction" className="pressable btn btn-accent group">
              Read the docs
              <ArrowRight
                width={13}
                height={13}
                className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="hero-stagger mt-10 [--stagger:140ms] sm:mt-12">
            <ViewSwitcher />
          </div>
        </div>
      </section>

      <div className={cn(container, 'space-y-20 py-20 sm:space-y-24 sm:py-24')}>
        {/* Features */}
        <Reveal
          as="section"
          className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border bg-border lg:grid-cols-12"
        >
          {FEATURES.map((feature) => (
            <Feature key={feature.title} {...feature} />
          ))}
        </Reveal>

        {/* Plugins */}
        <Reveal as="section">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <div>
              <p className="tag mb-1.5">◈ extend</p>
              <h2 className="display text-[1.625rem] leading-[1.15] [text-wrap:balance] sm:text-[2rem]">
                37 plugins, and room for yours.
              </h2>
              <p className="mt-1.5 max-w-xl text-[1.0625rem] leading-relaxed text-muted-fg [text-wrap:pretty]">
                Add columns, listing decorations and new commands, as native code or sandboxed WebAssembly.
              </p>
            </div>
            <Link
              href="/docs/first-party-plugins/overview"
              className="group inline-flex shrink-0 items-center gap-1 text-[0.9375rem] font-medium leading-6"
            >
              See all plugins
              <ArrowRight
                width={13}
                height={13}
                className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
              />
            </Link>
          </div>
          <PluginExplorer className="mt-5" />
        </Reveal>

        {/* Close */}
        <Reveal as="section" className="relative overflow-hidden rounded-lg border bg-surface">
          <Dither pattern="horizon" className="text-fg/[0.12]" />
          <div className="relative p-4 sm:p-6">
            <p className="tag mb-1.5">↓ install</p>
            <h2 className="display text-[1.625rem] leading-[1.15] sm:text-[2rem]">Try it on a directory you know.</h2>
            <p className="mt-1.5 text-[1.0625rem] text-muted-fg">
              Runs on Linux, macOS, NetBSD and Windows. MIT licensed.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <InstallTabs className="min-w-0 flex-1" />
              <Link href="/docs/about/installation" className="pressable btn btn-outline">
                All options
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
