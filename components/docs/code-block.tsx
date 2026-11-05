'use client'

import { cn } from '@/lib/utils'
import * as React from 'react'
import { CopyButton } from './copy-button'

export function CodeBlock({ className, children, ...props }: React.ComponentProps<'pre'>) {
  const ref = React.useRef<HTMLPreElement>(null)
  const language = (props as Record<string, unknown>)['data-language'] as string | undefined

  return (
    <div className="code-block group/code" data-language={language}>
      <div
        className={cn(
          'absolute right-2 top-2 z-10 rounded-md bg-[hsl(var(--code-bg))] transition-opacity duration-150',
          'opacity-0 focus-within:opacity-100 group-hover/code:opacity-100 [@media(hover:none)]:opacity-100'
        )}
      >
        <CopyButton label="Copy code" getText={() => ref.current?.textContent?.trimEnd() ?? ''} />
      </div>
      <pre ref={ref} className={className} {...props}>
        {children}
      </pre>
    </div>
  )
}
