'use client'

import { Code } from '@/components/docs/rehype/code'
import { cn } from '@/lib/utils'
import * as React from 'react'

interface PlainCodeProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string
  lang?: string
  withImportCopy?: boolean
}

export function PlainCode({ withImportCopy = false, lang = 'tsx', code, ...props }: PlainCodeProps) {
  const [isOpened, setIsOpened] = React.useState(true)
  return (
    <section className="my-6 not-prose">
      <div className={cn('overflow-hidden rounded-lg')}>
        <div className={'relative overflow-hidden'} {...props}>
          <div className={cn('overflow-hidden', !isOpened && 'h-full')}>
            <div className={cn('[&_pre]:my-0', !isOpened ? '[&_pre]:overflow-hidden' : '[&_pre]:overflow-auto]')}>
              <Code withImportCopy={withImportCopy} lang={lang} code={code} />
            </div>
          </div>
          {/* <div
              className={cn(
                'absolute flex items-center justify-center bg-gradient-to-b from-[#0e0e10]/50 to-black',
                isOpened ? 'inset-x-0 bottom-0 h-12' : 'inset-0'
              )}
            >
              <CollapsibleTrigger asChild>
                <Button intent="secondary" size="small">
                  {isOpened ? 'Collapse' : 'Expand'}
                </Button>
              </CollapsibleTrigger>
            </div> */}
        </div>
      </div>
    </section>
  )
}
