import { docs } from '#site/content'
import { Pager } from '@/components/docs/pager'
import { MobileToc, Toc, type TocEntry } from '@/components/docs/toc'
import { MDXContent } from '@/components/mdx-components'
import { Dither } from '@/components/site/dither'
import { Github, Pencil } from '@/components/site/icons'
import { siteConfig } from '@/config/site'
import { getNeighbours } from '@/lib/docs-nav'
import { SECTION_GLYPHS } from '@/lib/section-glyphs'
import '@/styles/docs.css'
import { type Metadata } from 'next'
import { notFound } from 'next/navigation'

export interface DocPageProps {
  params: Promise<{
    slug: string[]
  }>
}

async function getDoc(params: DocPageProps['params']) {
  const slug = (await params)?.slug?.join('/')
  return docs.find((doc) => doc.slugAsParams === slug)
}

export async function generateMetadata(props: DocPageProps): Promise<Metadata> {
  const doc = await getDoc(props.params)
  if (!doc) return {}

  return {
    title: `${doc.title} · ${siteConfig.name}`,
    description: doc.description,
    alternates: { canonical: `/${doc.slug}` },
    openGraph: { title: doc.title, description: doc.description, url: `/${doc.slug}`, type: 'article' }
  }
}

export async function generateStaticParams(): Promise<Array<{ slug: string[] }>> {
  return docs.map((doc) => ({ slug: doc.slugAsParams.split('/') }))
}

export default async function DocPage(props: DocPageProps) {
  const doc = await getDoc(props.params)
  if (!doc || !doc.published) notFound()

  const { section, previous, next } = getNeighbours(`/${doc.slug}`)
  const toc = doc.toc as TocEntry[]
  const source = doc.references?.[0]

  return (
    <div className="mx-auto flex max-w-[68rem] justify-center gap-10 px-4 pb-16 pt-6 sm:px-8 lg:pt-7">
      <article className="min-w-0 w-full max-w-[48rem] flex-1">
        <header className="relative mb-6">
          {/* Each page gets its own waves, from the length of its slug. */}
          <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-52 overflow-hidden sm:block">
            <Dither pattern="header" seed={doc.slug.length} className="text-fg/[0.12]" />
          </div>
          <div className="relative">
            {section && (
              <p className="tag mb-1.5">
                <span aria-hidden="true" className="mr-1.5 text-primary">
                  {SECTION_GLYPHS[section]}
                </span>
                {section}
              </p>
            )}
            <h1 className="display text-[2.125rem] leading-[1.15] sm:text-[2.375rem]">{doc.title}</h1>
            {doc.description && (
              <p className="mt-2 max-w-[35rem] text-lg leading-relaxed text-muted-fg [text-wrap:pretty]">{doc.description}</p>
            )}
          </div>
        </header>

        <MobileToc entries={toc} />

        <div className="doc">
          <MDXContent code={doc.body} />
        </div>

        <footer className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.9375rem] text-muted-fg">
          <a
            href={`${siteConfig.links.editBase}${doc.slug}.mdx`}
            className="inline-flex items-center gap-1.5 transition-colors duration-150 hover:text-fg"
          >
            <Pencil width={13} height={13} /> Edit this page
          </a>
          {source && (
            <a href={source} className="inline-flex items-center gap-1.5 transition-colors duration-150 hover:text-fg">
              <Github width={13} height={13} /> Source
            </a>
          )}
        </footer>

        <Pager previous={previous} next={next} />
      </article>

      <aside className="sticky top-[calc(var(--nav-height)+1.75rem)] hidden h-fit w-48 shrink-0 xl:block">
        <Toc entries={toc} />
      </aside>
    </div>
  )
}
