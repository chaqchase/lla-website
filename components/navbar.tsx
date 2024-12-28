'use client'

import { Aside } from '@/components/aside'
import { CommandPalette, type OpenCloseProps } from '@/components/command-palette'
import { Logo } from '@/components/logo'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { IconHamburger, IconSearch } from '@irsyadadl/paranoid'
import { LayoutGroup, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import React, { useEffect, useId, useState } from 'react'
import { Collection, Link } from 'react-aria-components'
import {
  Button,
  cn,
  LinkPrimitive,
  type LinkProps,
  MenuKeyboard,
  Separator,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetOverlay,
  useMediaQuery
} from 'ui'

const menuItems = [
  { id: 1, label: 'Home', url: '/' },
  { id: 2, label: 'Docs', url: '/docs/about/introduction' }
]

export function Navbar() {
  const id = useId()
  const pathname = usePathname()

  const [open, setOpen] = React.useState(false)

  return (
    <>
      <CommandPalette setOpen={setOpen} open={open} />
      <LayoutGroup id={`navigation-${id}`}>
        <div className="sticky xnw2 top-0 z-30 hidden overflow-hidden pb-0 sm:block">
          <nav className="border-b bg-background py-2">
            <div className="mx-auto max-w-screen-2xl px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-6">
                  <Link href="/" className="flex items-center">
                    <Logo className="h-5" /> <span className="text-lg italic font-bold">lla</span>
                  </Link>
                  <Separator orientation="vertical" className="h-6" />
                  <Collection items={menuItems}>
                    <NavLink isActive={pathname?.startsWith('/docs')} href="/docs/about/introduction">
                      Docs
                    </NavLink>
                    <NavLink target="_blank" href="https://github.com/triyanox/lla">
                      Github
                    </NavLink>
                  </Collection>
                </div>

                <div className="flex items-center gap-x-1">
                  <>
                    <Button
                      onPress={() => setOpen((open: boolean) => !open)}
                      size="small"
                      appearance="outline"
                      className="h-9"
                      aria-label="Open command palette"
                    >
                      <IconSearch />

                      <MenuKeyboard className="-mr-2 [&_kbd]:min-w-[3ch]" keys="⌘K" />
                    </Button>

                    <ThemeSwitcher />
                  </>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </LayoutGroup>
      <ResponsiveAside open={open} setOpen={setOpen} />
    </>
  )
}

export function NavLink({ href, isActive, ...props }: LinkProps & { isActive?: boolean }) {
  return (
    <LinkPrimitive
      href={href}
      className={cn(
        'relative flex items-center gap-x-3 py-2 text-sm font-semibold text-muted-fg transition-colors focus:outline-none sm:py-3',
        isActive ? 'text-fg' : 'text-muted-fg hover:text-fg',
        props.className
      )}
      {...props}
    >
      <>
        {props.children}
        {isActive && (
          <motion.span
            layoutId="current-indicator-navlink"
            className="absolute inset-x-0 bottom-[-0.550rem] h-0.5 w-full rounded bg-fg"
          />
        )}
      </>
    </LinkPrimitive>
  )
}

export function ResponsiveAside({ open, setOpen }: OpenCloseProps) {
  const id = useId()
  const [openAside, setOpenAside] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setOpenAside(false)
  }, [pathname])

  const isDesktop = useMediaQuery('(min-width: 1024px)')
  return (
    <nav className="sm:hidden z-10 relative">
      {!isDesktop && <CommandPalette setOpen={setOpen} open={open} />}
      <div className={cn('flex items-center justify-between pl-4 pr-2 -mb-2 pt-2')}>
        <Button
          aria-label="Open Menu"
          className="-ml-2 [&_[data-slot=icon]]:text-fg"
          appearance="outline"
          size="square-petite"
          onPress={() => setOpenAside((open) => !open)}
        >
          <IconHamburger />
        </Button>
        <Link className="focus:outline-none focus:ring-1 focus:ring-primary-500 rounded" href="/" aria-label="Logo">
          <Logo className="size-7" />
        </Link>
        <div className="flex items-center gap-x-1">
          <Button
            // @ts-expect-error
            onPress={() => setOpen((open: boolean) => !open)}
            size="square-petite"
            appearance="outline"
            aria-label="Open command palette"
          >
            <IconSearch />
            <MenuKeyboard className="-mr-2 [&_kbd]:min-w-[3ch]" keys="⌘K" />
          </Button>

          <ThemeSwitcher />
        </div>
      </div>
      {!isDesktop && (
        <Sheet isOpen={openAside} onOpenChange={setOpenAside}>
          <SheetOverlay>
            <SheetContent className="w-[19rem]" side="left" closeButton={true}>
              <SheetHeader className="mb-4 flex flex-row justify-between py-2">
                <Logo className="h-4" />
              </SheetHeader>
              <LayoutGroup id={id}>
                <Aside />
              </LayoutGroup>
            </SheetContent>
          </SheetOverlay>
        </Sheet>
      )}
    </nav>
  )
}
