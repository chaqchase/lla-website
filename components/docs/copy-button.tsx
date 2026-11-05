'use client'

import { Check, Copy } from '@/components/site/icons'
import { cn } from '@/lib/utils'
import * as React from 'react'

export function useCopy(duration = 1600) {
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => () => clearTimeout(timer.current), [])

  const copy = React.useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        clearTimeout(timer.current)
        timer.current = setTimeout(() => setCopied(false), duration)
      } catch {
        setCopied(false)
      }
    },
    [duration]
  )

  return { copied, copy }
}

/** Two icons share one cell; blur bridges the swap so it reads as a single morph. */
export function CopyIcon({ copied }: { copied: boolean }) {
  return (
    <span className="grid size-4 place-items-center" aria-hidden="true">
      <Copy
        className={cn(
          'col-start-1 row-start-1 transition-[opacity,transform,filter] duration-200 ease-out',
          copied ? 'scale-75 opacity-0 blur-[2px]' : 'scale-100 opacity-100'
        )}
      />
      <Check
        className={cn(
          'col-start-1 row-start-1 text-[hsl(var(--link))] transition-[opacity,transform,filter] duration-200 ease-out',
          copied ? 'scale-100 opacity-100' : 'scale-75 opacity-0 blur-[2px]'
        )}
      />
    </span>
  )
}

export function CopyButton({
  getText,
  label = 'Copy to clipboard',
  className
}: {
  getText: () => string
  label?: string
  className?: string
}) {
  const { copied, copy } = useCopy()

  return (
    <button
      type="button"
      aria-label={copied ? 'Copied' : label}
      onClick={() => copy(getText())}
      className={cn(
        'pressable grid size-7 place-items-center rounded-md text-muted-fg hover:bg-fg/5 hover:text-fg',
        className
      )}
    >
      <CopyIcon copied={copied} />
      <span aria-live="polite" className="sr-only">
        {copied ? 'Copied to clipboard' : ''}
      </span>
    </button>
  )
}
