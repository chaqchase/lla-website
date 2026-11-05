'use client'

import { Dither } from '@/components/site/dither'
import { ArrowRight } from '@/components/site/icons'
import { shots, type ShotName } from '@/lib/shots'
import { cn } from '@/lib/utils'
import { LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

const PLUGINS: Array<{ name: string; line: string; shot: ShotName }> = [
  { name: 'security_audit', line: 'Risky permissions, symlinks and secrets', shot: 'plugin-security-audit' },
  { name: 'project_context', line: 'Project type, toolchains and Git health', shot: 'plugin-project-inspect' },
  { name: 'file_hash', line: 'SHA-1 and SHA-256 under each file', shot: 'plugin-file-hash' },
  { name: 'file_meta', line: 'Timestamps, owner, size and mode', shot: 'plugin-file-meta' },
  { name: 'tree_summary', line: 'Totals on every branch of a tree', shot: 'plugin-tree-summary' },
  { name: 'activity_history', line: 'Commit counts, age and author per file', shot: 'plugin-activity' }
]

const KINDS = [
  {
    glyph: '■',
    title: 'Native plugins',
    meta: '.dylib, .so or .dll',
    line: 'Loaded into the host process. Fully trusted, like lla itself.',
    grants: [{ label: 'full access', on: true }]
  },
  {
    glyph: '□',
    title: 'WebAssembly components',
    meta: 'plugin.wasm',
    line: 'Sandboxed, with only the access you grant.',
    grants: [{ label: 'read', on: true }, { label: 'network' }, { label: 'exec' }, { label: 'clipboard' }]
  }
]

/** Hovering a plugin previews what it prints. Clicking opens its page. */
export function PluginExplorer({ className }: { className?: string }) {
  const [active, setActive] = React.useState(0)
  const reduceMotion = useReducedMotion()

  return (
    <div className={cn('overflow-hidden rounded-lg border bg-surface', className)}>
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <LayoutGroup id="plugin-explorer">
          <ul className="space-y-px p-1.5 lg:col-span-4 lg:border-r">
            {PLUGINS.map((plugin, index) => {
              const selected = index === active
              return (
                <li key={plugin.name}>
                  <Link
                    href={`/docs/first-party-plugins/${plugin.name}`}
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    className="group relative flex items-center justify-between gap-3 rounded-md px-2.5 py-1.5"
                  >
                    {selected && (
                      <motion.span
                        layoutId="plugin-pill"
                        transition={reduceMotion ? { duration: 0 } : { type: 'spring', duration: 0.26, bounce: 0.06 }}
                        className="absolute inset-0 rounded-md bg-secondary"
                      />
                    )}
                    <span className="relative min-w-0">
                      <span className="block truncate font-mono text-sm leading-5">{plugin.name}</span>
                      <span className="block truncate text-sm leading-5 text-muted-fg">{plugin.line}</span>
                    </span>
                    <ArrowRight
                      width={13}
                      height={13}
                      className={cn(
                        'relative shrink-0 text-muted-fg transition-[transform,opacity] duration-150 ease-out',
                        selected ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0'
                      )}
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
        </LayoutGroup>

        {/* Wider than its column so the text stays readable. The output sits well inside the crop. */}
        <div className="relative h-56 overflow-hidden border-t bg-background lg:col-span-8 lg:h-auto lg:border-t-0">
          <Dither pattern="rings" seed={2} className="text-fg/[0.12]" />
          {PLUGINS.map((plugin, index) => {
            const { w, h } = shots[plugin.shot]
            const selected = index === active
            return (
              <Image
                key={plugin.shot}
                src={`/shots/${plugin.shot}.png`}
                alt={`Terminal output from the ${plugin.name} plugin.`}
                width={w}
                height={h}
                sizes="920px"
                quality={90}
                draggable={false}
                aria-hidden={!selected}
                className={cn(
                  'absolute left-4 top-4 w-[640px] max-w-none rounded-tl-md ring-1 ring-fg/[0.06] transition-[opacity,filter] duration-200 ease-out lg:left-5 lg:top-5 lg:w-[920px]',
                  selected ? 'opacity-100 blur-0' : 'pointer-events-none opacity-0 blur-[2px]'
                )}
              />
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-px border-t bg-border sm:grid-cols-3">
        {KINDS.map((kind) => (
          <div key={kind.title} className="flex flex-col bg-surface p-3.5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h3 className="text-[0.9375rem] font-medium leading-5">
                <span aria-hidden="true" className="mr-1.5 font-mono text-primary">
                  {kind.glyph}
                </span>
                {kind.title}
              </h3>
              <span className="tag leading-5">{kind.meta}</span>
            </div>
            <p className="mb-2.5 mt-0.5 text-sm leading-5 text-muted-fg">{kind.line}</p>
            <ul className="mt-auto flex flex-wrap gap-1">
              {kind.grants.map((grant) => (
                <li
                  key={grant.label}
                  className={cn(
                    'flex h-6 items-center rounded-[3px] border px-1.5 font-mono text-[0.8125rem]',
                    grant.on ? 'border-primary/30 bg-primary/[0.08] text-fg' : 'text-muted-fg'
                  )}
                >
                  {grant.label}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <Link
          href="/docs/guides/plugin-development-tutorial"
          className="group flex flex-col bg-surface p-3.5 transition-colors duration-150 hover:bg-secondary/60"
        >
          <h3 className="text-[0.9375rem] font-medium leading-5">
            <span aria-hidden="true" className="mr-1.5 font-mono text-primary">
              ✦
            </span>
            Write your own
          </h3>
          <p className="mb-2.5 mt-0.5 text-sm leading-5 text-muted-fg">Typed fields, formatting and actions through one plugin interface.</p>
          <span className="mt-auto inline-flex h-6 items-center gap-1 text-sm font-medium">
            Plugin tutorial
            <ArrowRight width={13} height={13} className="transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
          </span>
        </Link>
      </div>
    </div>
  )
}
