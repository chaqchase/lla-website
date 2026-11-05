'use client'

import { CopyIcon, useCopy } from '@/components/docs/copy-button'
import { Chevron } from '@/components/site/icons'
import { cn } from '@/lib/utils'
import * as React from 'react'

const METHODS = [
  { id: 'script', label: 'Script', command: 'curl -sSL https://raw.githubusercontent.com/chaqchase/lla/main/install.sh | bash' },
  { id: 'brew', label: 'Homebrew', command: 'brew install lla' },
  { id: 'cargo', label: 'Cargo', command: 'cargo install lla' },
  { id: 'windows', label: 'Windows', command: 'irm https://raw.githubusercontent.com/chaqchase/lla/main/install.ps1 | iex' },
  { id: 'paru', label: 'Arch', command: 'paru -S lla' },
  { id: 'pkgin', label: 'NetBSD', command: 'pkgin install lla' }
]

/** One compact control: pick a package manager, see its command, click to copy. */
export function InstallTabs({ className }: { className?: string }) {
  const [active, setActive] = React.useState(METHODS[0].id)
  const { copied, copy } = useCopy()
  const method = METHODS.find((item) => item.id === active)!

  return (
    <div className={cn('flex h-8 items-stretch overflow-hidden rounded-md border bg-background text-sm transition-colors duration-150 focus-within:border-fg/25 hover:border-fg/15', className)}>
      <div className="relative shrink-0 border-r">
        <select
          aria-label="Install method"
          value={active}
          onChange={(event) => setActive(event.target.value)}
          className="h-full w-[6.5rem] cursor-pointer appearance-none bg-transparent pl-2.5 pr-5 text-sm text-muted-fg outline-none transition-colors duration-150 hover:text-fg"
        >
          {METHODS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        <Chevron width={10} height={10} className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 rotate-90 text-muted-fg" />
      </div>
      <button
        type="button"
        onClick={() => copy(method.command)}
        aria-label={`Copy command: ${method.command}`}
        title={method.command}
        className="group flex min-w-0 flex-1 items-center gap-2 pl-2.5 pr-2 text-left font-mono text-sm"
      >
        <span aria-hidden="true" className="select-none text-muted-fg">
          $
        </span>
        <span key={method.id} className="min-w-0 flex-1 truncate animate-in fade-in-0 duration-200">
          {method.command}
        </span>
        <span className="shrink-0 text-muted-fg transition-colors duration-150 group-hover:text-fg">
          <CopyIcon copied={copied} />
        </span>
      </button>
    </div>
  )
}
