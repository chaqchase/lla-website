import { Logo } from '@/components/logo'
import { Reveal } from '@/components/site/reveal'
import { cn } from '@/lib/utils'
import { Fragment, type CSSProperties, type ReactNode } from 'react'

const mono = 'font-mono text-[0.8125rem] leading-[1.125rem]'
const title = 'text-[0.9375rem] font-medium leading-5'

function Wire({
  accent,
  flow,
  vertical,
  up,
  plain,
  delay = 0,
  className
}: {
  accent?: boolean
  /** A dot travels along the line. Only used where it explains where data goes. */
  flow?: boolean
  vertical?: boolean
  up?: boolean
  /** Leave off the arrowhead, for a line that joins another. */
  plain?: boolean
  delay?: number
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      data-accent={accent ? '' : undefined}
      data-up={up ? '' : undefined}
      data-plain={plain ? '' : undefined}
      style={{ '--draw-delay': `${delay}ms` } as CSSProperties}
      className={cn(vertical ? 'wire-v' : 'wire', className)}
    >
      {flow && <span className="wire-dot" />}
    </span>
  )
}

function Node({
  accent,
  dashed,
  className,
  children
}: {
  accent?: boolean
  dashed?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn('rounded-md border bg-background', accent && 'border-primary/30', dashed && 'border-dashed border-fg/15', className)}>
      {children}
    </div>
  )
}

function Figure({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <Reveal className={className}>
      <div role="img" aria-label={label}>
        {children}
      </div>
    </Reveal>
  )
}

/** How plugins attach to the host: native code in process, WebAssembly behind grants. */
export function PluginPlatform({ className }: { className?: string }) {
  const stages = [{ label: 'walk' }, { label: 'filter' }, { label: 'decorate', accent: true }, { label: 'format', accent: true }]
  const grants = [{ label: 'read', on: true }, { label: 'network' }, { label: 'exec' }, { label: 'clipboard' }]

  return (
    <Figure
      className={className}
      label="The lla host runs a listing pipeline of walk, filter, decorate and format. Native plugins attach directly inside the host process. WebAssembly components attach through a gate of declared, persisted grants."
    >
      <Node className="p-3">
        <div className="flex items-baseline gap-2">
          <span className="text-[0.9375rem] font-semibold leading-5">lla</span>
          <span className={cn(mono, 'text-muted-fg')}>host process</span>
        </div>
        <div className="mt-2.5 flex items-center">
          {stages.map((stage, index) => (
            <Fragment key={stage.label}>
              {index > 0 && <Wire delay={index * 90} className="w-3 shrink-0 sm:w-4" />}
              <div
                className={cn(
                  'flex h-7 min-w-0 flex-1 items-center justify-center rounded-[4px] border',
                  mono,
                  stage.accent ? 'border-primary/30 text-fg' : 'text-muted-fg'
                )}
              >
                {stage.label}
              </div>
            </Fragment>
          ))}
        </div>
        <div className={cn('mt-2.5 flex flex-wrap items-center gap-x-2.5 border-t pt-2', mono)}>
          <span className="text-fg">plugin interface</span>
          <span className="text-muted-fg">typed fields, formatting, actions</span>
        </div>
      </Node>

      {/* On a phone the DOM order reads top to bottom; from sm up the grid places each piece. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-3">
        <div className="flex h-5 justify-center sm:col-start-1 sm:row-start-1 sm:h-auto">
          <Wire vertical accent flow delay={350} className="h-full" />
        </div>
        <Node className="p-3 sm:col-start-1 sm:row-start-2">
          <div className={title}>Native plugin</div>
          <div className={cn(mono, 'mt-1 text-muted-fg')}>libplugin.dylib, .so or .dll</div>
          <p className="mt-2.5 text-sm leading-5 text-muted-fg">Loaded into the host process. Fully trusted, like lla itself.</p>
        </Node>

        <div className="flex flex-col items-center sm:col-start-2 sm:row-start-1">
          <Wire vertical accent plain delay={350} className="h-3" />
          <div className={cn('rounded-[4px] border border-primary/30 bg-background px-2.5 py-1 text-fg', mono)}>declared, persisted grants</div>
          <Wire vertical accent flow delay={550} className="h-4" />
        </div>
        <Node dashed className="p-3 sm:col-start-2 sm:row-start-2">
          <div className={title}>WebAssembly component</div>
          <div className={cn(mono, 'mt-1 text-muted-fg')}>plugin.wasm, sandboxed</div>
          <div className="mt-2.5 flex flex-wrap gap-1">
            {grants.map((grant) => (
              <span
                key={grant.label}
                className={cn(
                  'rounded-[3px] border px-1.5',
                  mono,
                  grant.on ? 'border-primary/30 bg-primary/[0.08] text-fg' : 'text-muted-fg'
                )}
              >
                {grant.label}
              </span>
            ))}
          </div>
        </Node>
      </div>
    </Figure>
  )
}

/** One listing leaves as three formats and goes wherever the shell can send it. */
export function OutputPipeline({ className }: { className?: string }) {
  const outputs = [
    { flag: '--json', note: 'one array', to: 'jq' },
    { flag: '--ndjson', note: 'one object a line', to: 'duckdb' },
    { flag: '--csv', note: 'fixed columns', to: 'your script' }
  ]

  return (
    <Figure
      className={className}
      label="A directory goes into lla and comes out as JSON, newline-delimited JSON, or CSV, ready for jq, DuckDB, or your own scripts."
    >
      <div className="flex flex-col items-stretch sm:flex-row sm:items-center">
        <Node className="shrink-0 p-2.5 sm:w-[7.5rem]">
          <div className={cn(mono, 'text-muted-fg')}>a directory</div>
          <div className="mt-1.5 space-y-1">
            {[80, 56, 92, 64].map((width) => (
              <div key={width} className="flex items-center gap-1">
                <span className="size-1 shrink-0 rounded-[1px] bg-fg/30" />
                <span className="block h-[3px] rounded-[1px] bg-fg/15" style={{ width: `${width}%` }} />
              </div>
            ))}
          </div>
        </Node>
        <Wire delay={100} className="hidden w-4 shrink-0 sm:block" />
        <div className="flex h-3 justify-center sm:hidden">
          <Wire vertical delay={100} className="h-full" />
        </div>

        <Node accent className="flex h-9 shrink-0 items-center justify-center gap-1.5 px-3">
          <Logo className="w-3.5" />
          <span className="text-[0.9375rem] font-semibold leading-none">lla</span>
        </Node>
        <Wire accent plain delay={200} className="hidden w-3 shrink-0 sm:block" />
        <div className="flex h-3 justify-center sm:hidden">
          <Wire vertical accent delay={200} className="h-full" />
        </div>

        <div className="relative min-w-0 flex-1">
          <span aria-hidden="true" className="absolute inset-y-4 left-0 hidden w-px bg-primary/45 sm:block" />
          <ul className="space-y-1.5">
            {outputs.map((output, index) => (
              <li key={output.flag} className="flex items-center">
                <Wire accent flow delay={300 + index * 80} className="hidden w-4 shrink-0 sm:block" />
                <Node className="flex h-8 min-w-0 flex-1 items-center justify-between gap-3 px-2.5">
                  <span className={cn(mono, 'text-fg')}>{output.flag}</span>
                  <span className={cn(mono, 'truncate text-muted-fg')}>{output.note}</span>
                </Node>
                <Wire delay={420 + index * 80} className="w-3 shrink-0 sm:w-4" />
                <span className="w-[6rem] shrink-0 pl-2 text-sm font-medium leading-5">{output.to}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Figure>
  )
}

/** Upper layers win. Four rows in the order lla applies them. */
export function ConfigLayers({ className }: { className?: string }) {
  const layers = [
    { name: 'Command-line flags', path: 'lla -l --relative-dates', note: 'This run only', accent: true },
    { name: 'Project profile', path: '.lla.toml', note: 'Nearest one, walking up' },
    { name: 'Your config', path: '~/.config/lla/config.toml', note: 'Every run' },
    { name: 'Built-in defaults', path: 'Compiled into lla', note: 'Always underneath' }
  ]

  return (
    <Figure
      className={className}
      label="Configuration layers from top to bottom: command-line flags, project profile, your config file, and built-in defaults. Upper layers override lower ones."
    >
      <div className="flex gap-2.5">
        <div className="flex w-3 shrink-0 justify-center">
          <Wire vertical up accent delay={200} className="h-full" />
        </div>
        <ul className="min-w-0 flex-1 space-y-1.5">
          {layers.map((layer) => (
            <li key={layer.name}>
              <Node accent={layer.accent} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-0.5 px-3 py-2">
                <div className="min-w-0">
                  <div className={title}>{layer.name}</div>
                  <div className={cn(mono, 'truncate text-muted-fg')}>{layer.path}</div>
                </div>
                <div className={cn(mono, 'text-muted-fg')}>{layer.note}</div>
              </Node>
            </li>
          ))}
        </ul>
      </div>
    </Figure>
  )
}

/** Entries pass through independent filters; whatever survives reaches the view. */
export function FilterGates({ className }: { className?: string }) {
  const rows = [
    { label: 'all entries', note: '', width: 100 },
    { label: '--filter', note: 'name', width: 64 },
    { label: '--files-only', note: 'type', width: 46 },
    { label: '--size', note: 'bytes', width: 28 },
    { label: '--modified', note: 'time', width: 14 },
    { label: 'view', note: 'any of ten', width: 14, accent: true }
  ]

  return (
    <Figure className={className} label="All entries pass through filters for name, type, size and time, leaving fewer at each step. The view draws what is left.">
      <ul className="space-y-2">
        {rows.map((row, index) => (
          <li key={row.label} className="grid grid-cols-[6.75rem_minmax(0,1fr)_5rem] items-center gap-2.5">
            <span className={cn(mono, row.accent ? 'font-medium text-fg' : 'text-fg/80')}>{row.label}</span>
            <span className="block h-1.5 rounded-[2px] bg-fg/[0.06]">
              <span
                className={cn('bar block h-full rounded-[2px]', row.accent ? 'bg-primary' : 'bg-fg/30')}
                style={{ width: `${row.width}%`, '--bar-delay': `${index * 90}ms` } as CSSProperties}
              />
            </span>
            <span className={cn(mono, 'text-right text-muted-fg')}>{row.note}</span>
          </li>
        ))}
      </ul>
    </Figure>
  )
}

/** Why `j` exists: a child process cannot change its parent shell's directory. */
export function JumpFlow({ className }: { className?: string }) {
  const entries = [
    { mark: '★', name: 'src', selected: true },
    { mark: '★', name: 'plugins' },
    { mark: '', name: 'lla' }
  ]

  return (
    <Figure
      className={className}
      label="The j shell function starts lla jump. You pick a directory and lla prints its path. Back in your shell, the function runs cd on that path."
    >
      <div className="grid grid-cols-1 gap-y-1.5 sm:grid-cols-[minmax(0,1fr)_8rem_minmax(0,1fr)]">
        <Node className="flex flex-col p-3">
          <div className={cn(mono, 'text-muted-fg')}>your shell</div>
          <div className="mt-2 flex flex-1 flex-col gap-1.5">
            <div className={cn('flex min-h-8 flex-1 items-center gap-2 rounded-[4px] border border-primary/30 px-2.5', mono)}>
              <span className="font-medium text-fg">j</span>
              <span className="truncate text-muted-fg">generated shell function</span>
            </div>
            <div className={cn('flex min-h-8 flex-1 items-center rounded-[4px] border px-2.5 text-fg', mono)}>cd /path/you/picked</div>
          </div>
        </Node>

        {/* Same padding as the panels, so each wire lines up with the row it belongs to. */}
        <div className="hidden flex-col gap-1.5 px-2 pb-[calc(0.75rem+1px)] pt-[calc(1.75rem+2px)] sm:flex">
          <div className="flex flex-1 items-center">
            <div className="relative w-full">
              <span className={cn(mono, 'absolute inset-x-0 bottom-1 text-center text-muted-fg')}>starts</span>
              <Wire accent flow delay={200} />
            </div>
          </div>
          <div className="flex flex-1 items-center">
            <div className="relative w-full">
              <span className={cn(mono, 'absolute inset-x-0 bottom-1 whitespace-nowrap text-center text-muted-fg')}>prints path</span>
              <div className="rotate-180">
                <Wire accent flow delay={500} />
              </div>
            </div>
          </div>
        </div>
        <p className={cn(mono, 'text-center text-muted-fg sm:hidden')}>starts it, then reads back the path</p>

        <Node dashed className="flex flex-col p-3">
          <div className={cn(mono, 'text-muted-fg')}>lla jump, a child process</div>
          <ul className="mt-2 space-y-0.5">
            {entries.map((entry) => (
              <li
                key={entry.name}
                className={cn('flex h-7 items-center gap-2 rounded-[4px] px-2', mono, entry.selected ? 'bg-primary/[0.08] text-fg' : 'text-muted-fg')}
              >
                <span className={cn('w-3 text-center', entry.selected && 'text-primary')}>{entry.mark}</span>
                {entry.name}
              </li>
            ))}
          </ul>
        </Node>
      </div>
    </Figure>
  )
}

/** The dashed branch leads nowhere. */
export function MissingBranch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 170" fill="none" role="img" aria-label="A directory tree with a dashed branch that ends at an empty node." className={className}>
      <path d="M40 18 V112" className="stroke-fg/20" />
      {[42, 74].map((y) => (
        <g key={y}>
          <path d={`M40 ${y} H70`} className="stroke-fg/20" />
          <rect x={76} y={y - 5} width={10} height={10} rx={2} className="stroke-fg/25" />
          <rect x={94} y={y - 2} width={y === 42 ? 92 : 66} height={4} rx={2} className="fill-fg/15" />
        </g>
      ))}
      <path d="M40 112 V126 H72" strokeDasharray="3 4" className="stroke-primary" />
      <circle cx={84} cy={126} r={8} strokeDasharray="3 3" className="stroke-primary" />
      <rect x={32} y={8} width={16} height={12} rx={2.5} className="fill-background stroke-fg/25" />
    </svg>
  )
}
