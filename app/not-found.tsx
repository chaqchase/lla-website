import { MissingBranch } from '@/components/illustrations'
import { Dither } from '@/components/site/dither'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="relative overflow-hidden">
      <Dither pattern="wings" cell={3} interactive className="hidden text-fg/10 sm:block" />
      <div className="relative mx-auto flex max-w-md flex-col items-center px-6 py-20 text-center sm:py-28">
        <MissingBranch className="w-32" />
        <p className="tag mt-6">404 ⌀</p>
        <h1 className="display mt-1.5 text-[1.75rem] leading-[1.1]">Page not found</h1>
        <p className="mt-2 text-[1.0625rem] leading-relaxed text-muted-fg">
          This page may have moved. Search with <kbd className="rounded-[3px] border px-1 font-sans text-[0.6875rem]">⌘K</kbd>, or go back to the docs.
        </p>
        <div className="mt-5 flex gap-2">
          <Link href="/docs/about/introduction" className="pressable btn btn-accent">
            Read the docs
          </Link>
          <Link href="/" className="pressable btn btn-outline">
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
