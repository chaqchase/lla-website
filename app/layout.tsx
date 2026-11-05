import { Footer } from '@/components/site/footer'
import { Nav } from '@/components/site/nav'
import { Providers } from '@/components/providers'
import { SearchProvider } from '@/components/site/search'
import { siteConfig } from '@/config/site'
import { getDocsNav } from '@/lib/docs-nav'
import { cn } from '@/lib/utils'
import '@/styles/app.css'
import type { Metadata, Viewport } from 'next'
import { Host_Grotesk, IBM_Plex_Mono } from 'next/font/google'
import React from 'react'

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name}: a better view of every directory`,
    template: `%s`
  },
  description: siteConfig.description,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? siteConfig.url),
  openGraph: {
    siteName: siteConfig.name,
    title: `${siteConfig.name}: a better view of every directory`,
    description: siteConfig.description,
    type: 'website',
    images: [{ url: '/static/og.png', width: 2400, height: 1260 }]
  },
  twitter: { card: 'summary_large_image' }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#090909' }
  ]
}

const sans = Host_Grotesk({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' })

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const nav = getDocsNav()

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={cn('min-h-svh bg-background font-sans antialiased', sans.variable, mono.variable)}>
        <Providers>
          <SearchProvider nav={nav}>
            <div className="relative flex min-h-dvh flex-col">
              <Nav nav={nav} />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </SearchProvider>
        </Providers>
      </body>
    </html>
  )
}
