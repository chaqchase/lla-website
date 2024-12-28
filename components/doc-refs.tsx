'use client'

import { Logo } from '@/components/logo'
import { IconBell, IconBrandAdobe, IconBrandFramer, IconBrandGithub, IconBrandParanoid } from '@irsyadadl/paranoid'
import type { FC, SVGProps } from 'react'
import { Menu, MenuItem } from 'react-aria-components'
import { buttonStyles, cn } from 'ui'

export function DocRefs({ references }: any) {
  const urls = references.map((url: string) => {
    let title = ''
    let icon: FC<SVGProps<SVGSVGElement>>

    switch (true) {
      case url.includes('themes'):
        title = 'Get Themes'
        icon = IconBrandGithub
        break
      case url.includes('lla_plugin_interface'):
        title = 'Plugin Interface'
        icon = IconBrandGithub
        break
      case url.includes('plugins.mdx'):
        title = 'Plugins'
        icon = IconBrandGithub
        break
      case url.includes('react-spectrum'):
        title = 'Props Reference'
        icon = IconBrandAdobe
        break
      case url.includes('paranoid'):
        title = 'Paranoid'
        icon = IconBrandParanoid
        break
      case url.includes('framer'):
        title = 'Framer Motion'
        icon = IconBrandFramer
        break
      case url.includes('docs/components'):
        title = 'Internal'
        icon = Logo
        break
      case url.includes('sonner'):
        title = 'Toaster'
        icon = IconBell
        break
      case url.includes('github'):
        title = 'Github'
        icon = IconBrandGithub
        break
      default:
        icon = IconBrandGithub
    }

    return {
      url,
      title,
      icon
    }
  })

  return (
    <Menu className="not-prose gap-x-2 flex" aria-label="Link References" items={urls}>
      {(item: any) => (
        <MenuItem
          target="_blank"
          className={cn(buttonStyles({ appearance: 'outline', size: 'small', className: 'focus:outline-0' }))}
          id={item.url}
          href={item.url}
        >
          <item.icon />
          {item.title === 'Props Reference' ? (
            <span>
              Props <span className="sm:inline hidden">Reference</span>
            </span>
          ) : (
            <span>{item.title}</span>
          )}
        </MenuItem>
      )}
    </Menu>
  )
}
