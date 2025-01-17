'use client'

import { docs, type Docs } from '@/.velite'
import { goodTitle, sortDocs } from '@/lib/utils'
import { IconChevronDown } from '@irsyadadl/paranoid'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@radix-ui/react-accordion'
import { LayoutGroup, motion } from 'framer-motion'
import type { LinkProps } from 'next/link'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Badge, cn } from 'ui'

export interface Doc {
  slug: string
  title: string
  status?: 'wip' | 'new' | 'beta' | 'help'
}

export interface HierarchyNode {
  [key: string]: HierarchyNode | Doc
}

export const createHierarchy = (docs: Array<Docs>): HierarchyNode => {
  const hierarchy: HierarchyNode = {}

  sortDocs(docs).forEach((doc) => {
    const parts = doc.slug.split('/').slice(1) // Remove the 'docs' part
    let currentLevel = hierarchy

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        // @ts-ignore
        currentLevel[part] = doc
      } else {
        if (!currentLevel[part]) {
          currentLevel[part] = {}
        }
        currentLevel = currentLevel[part] as HierarchyNode
      }
    })
  })

  return hierarchy
}

const renderHierarchy = (node: HierarchyNode, level: number = 0) => {
  const filteredNodeEntries = Object.entries(node)
    .sort(([a], [b]) => {
      const order: string[] = []
      return order.indexOf(a) - order.indexOf(b)
    })
    .sort(([a], [b]) => {
      if (a === 'about') return -1
      if (b === 'about') return 1
      if (a === 'usage') return -1
      if (b === 'usage') return 1
      if (a === 'plugins') return -1
      if (b === 'plugins') return 1
      if (a === 'first-party-plugins') return -1
      if (b === 'first-party-plugins') return 1
      return 0
    })
  return (
    <>
      <Accordion type="multiple" defaultValue={['about', 'usage', 'plugins', 'first-party-plugins']} className="w-full">
        {filteredNodeEntries.map(([key, value]) => (
          <AccordionItem key={key} value={key}>
            <Trigger className="[&_.jr131]:size-4 [&_.jr131]:text-zinc-500 [&_.jr131]:fill-zinc-500/10 dark:[&_.jr131]:fill-zinc-500/30">
              {goodTitle(key)}
            </Trigger>
            <AccordionContent className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              {typeof value === 'object' && 'title' in value ? (
                <AsideLink href={`/${(value as Doc).slug}`}>{goodTitle((value as Doc).title)}</AsideLink>
              ) : (
                <Accordion type="multiple" className="w-full relative">
                  <div className="h-full absolute left-0 bg-zinc-200 dark:bg-zinc-800 w-px ml-4" />
                  {Object.entries(value as HierarchyNode).map(([subKey, subValue]) =>
                    typeof subValue === 'object' && 'title' in subValue ? (
                      <AsideLink
                        className="pl-[2rem] flex items-center gap-x-2"
                        key={subKey}
                        href={`/${subValue.slug}`}
                      >
                        {goodTitle((subValue as Doc).title)}{' '}
                        {subValue.status && (
                          <Badge
                            intent={
                              subValue?.status === 'wip'
                                ? 'primary'
                                : subValue.status === 'beta'
                                  ? 'warning'
                                  : subValue.status === 'help'
                                    ? 'warning'
                                    : subValue.status === 'new'
                                      ? 'success'
                                      : 'info'
                            }
                            className="lowercase text-xs"
                          >
                            {subValue?.status as Doc['status']}
                          </Badge>
                        )}
                      </AsideLink>
                    ) : (
                      <AccordionItem key={subKey} value={subKey}>
                        <Trigger className="pl-[2rem] text-muted-fg group-data-[state=open]:text-fg">
                          {goodTitle(subKey)}
                        </Trigger>
                        <AccordionContent className="relative overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                          {Object.entries(subValue as HierarchyNode).map(([childKey, childValue]) =>
                            typeof childValue === 'object' && 'title' in childValue ? (
                              <AsideLink
                                className="ml-[-0rem] flex justify-between items-center pl-[3rem]"
                                key={childKey}
                                href={`/${childValue.slug}`}
                                indicatorClassName=""
                              >
                                {goodTitle((childValue as Doc).title)}{' '}
                                {childValue.status && (
                                  <Badge
                                    intent={
                                      childValue?.status === 'wip'
                                        ? 'primary'
                                        : childValue.status === 'beta'
                                          ? 'warning'
                                          : childValue.status === 'help'
                                            ? 'warning'
                                            : childValue.status === 'new'
                                              ? 'success'
                                              : 'info'
                                    }
                                    className="lowercase text-xs"
                                  >
                                    {childValue?.status as Doc['status']}
                                  </Badge>
                                )}
                              </AsideLink>
                            ) : (
                              <AccordionItem key={childKey} value={childKey}>
                                <Trigger className="text-muted-fg group-data-[state=open]:text-fg">
                                  {goodTitle(childKey)}
                                </Trigger>
                                <AccordionContent className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                                  {renderHierarchy(childValue as HierarchyNode, level + 1)}
                                </AccordionContent>
                              </AccordionItem>
                            )
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    )
                  )}
                </Accordion>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  )
}

const Aside = () => {
  const id = React.useId()
  const hierarchicalDocs = createHierarchy(docs)
  return (
    <LayoutGroup id={id}>
      <aside>{renderHierarchy(hierarchicalDocs)}</aside>
    </LayoutGroup>
  )
}

export { Aside }

export function Trigger({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <AccordionTrigger
      className={cn(
        'relative group flex items-center gap-x-2 w-full focus:outline-none focus-visible:ring-1 focus-visible:bg-secondary focus-visible:ring-primary-500 rounded-md px-2.5 py-2 text-left text-base transition-colors hover:bg-secondary/70 hover:text-fg lg:text-sm',
        className
      )}
    >
      {children}
      <IconChevronDown className="absolute right-2.5 top-1/2 transition-transform -translate-y-1/2 text-muted-fg group-data-[state=open]:rotate-180 group-data-[state=open]:text-fg" />
    </AccordionTrigger>
  )
}

interface AsideLinkProps extends LinkProps {
  active?: boolean
  children: React.ReactNode
  className?: string
  indicatorClassName?: string
}

function AsideLink({ indicatorClassName, className, children, active, ...props }: AsideLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === props.href
  return (
    <Link
      className={cn(
        'relative block focus:outline-none focus-visible:bg-secondary focus-visible:ring-1 focus-visible:ring-primary-500 rounded-md px-2.5 py-2 text-base font-medium transition-colors hover:bg-secondary/70 hover:text-fg lg:text-sm',
        isActive ? 'font-semibold text-fg' : 'text-muted-fg',
        className
      )}
      {...props}
    >
      {children}
      {isActive && (
        <motion.span
          layoutId="current-indicator-sidebar"
          className={cn('absolute inset-y-1 left-[1rem] w-0.5 rounded-full bg-fg', indicatorClassName)}
        />
      )}
    </Link>
  )
}
