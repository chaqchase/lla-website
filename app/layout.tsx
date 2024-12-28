import { Navbar } from '@/components/navbar'
import { Providers } from '@/components/providers'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import '@/styles/app.css'
import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import localFont from 'next/font/local'
import React from 'react'
export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? siteConfig.url)
}

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
})

const sans = localFont({
  src: './fonts/pretendard-variable.woff2',
  display: 'auto',
  variable: '--font-sans'
})

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-svh [max-width:1850px] mx-auto bg-background font-sans antialiased',
          mono.variable,
          sans.variable
        )}
      >
        <Providers>
          <div className="relative flex min-h-dvh flex-col bg-background">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
