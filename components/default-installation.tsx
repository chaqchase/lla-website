'use client'

import React from 'react'
import { Snippet, Tab, TabList, TabPanel, Tabs } from 'ui'

interface InstallProps {
  items?: string[]
}

const DefaultInstallation: React.FC<InstallProps> = ({ items = [] }) => {
  const getInstallCommand = (packageManager: string) => {
    switch (packageManager) {
      case 'brew':
        return `brew install ${items.join(' ')}`
      case 'paru':
        return `paru -S ${items.join(' ')}`
      case 'pkgin':
        return `pkgin install ${items.join(' ')}`
      default:
        return `cargo install ${items.join(' ')}`
    }
  }

  return (
    <div>
      <Tabs className="mt-4" aria-label="Packages">
        <TabList>
          <Tab className="font-mono" id="brew">
            brew
          </Tab>
          <Tab className="font-mono" id="paru">
            paru
          </Tab>
          <Tab className="font-mono" id="pkgin">
            pkgin
          </Tab>
        </TabList>
        <TabPanel id="brew">
          <Snippet className="bg-[#0e0e10] text-zinc-200" text={getInstallCommand('brew')} />
        </TabPanel>
        <TabPanel id="paru">
          <Snippet className="bg-[#0e0e10] text-zinc-200" text={getInstallCommand('paru')} />
        </TabPanel>
        <TabPanel id="pkgin">
          <Snippet className="bg-[#0e0e10] text-zinc-200" text={getInstallCommand('pkgin')} />
        </TabPanel>
      </Tabs>
    </div>
  )
}

export { DefaultInstallation }
