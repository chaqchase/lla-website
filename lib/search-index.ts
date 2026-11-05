import { docs } from '#site/content'
import GithubSlugger from 'github-slugger'

export interface SearchRecord {
  id: string
  title: string
  slug: string
  section?: string
  sectionSlug?: string
  content: string
}

const MIN_SECTION_LENGTH = 20
const CONTENT_CHAR_LIMIT = 4000

function stripHtml(html: string): string {
  return html
    .replace(/<pre[\s\S]*?<\/pre>/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&#x3C;/g, '<')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function sectionsFrom(html: string) {
  const slugger = new GithubSlugger()
  const headings = Array.from(html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)).map((match) => {
    const heading = stripHtml(match[0])
    return { heading, slug: slugger.slug(heading), start: match.index!, end: match.index! + match[0].length }
  })

  return headings.map((current, index) => ({
    heading: current.heading,
    slug: current.slug,
    content: stripHtml(html.slice(current.end, headings[index + 1]?.start ?? html.length))
  }))
}

/** A lean, serializable index. Page bodies never reach the client bundle. */
export function buildSearchRecords(): SearchRecord[] {
  return docs
    .filter((doc) => doc.published)
    .flatMap((doc) => {
      const page: SearchRecord = {
        id: doc.slug,
        title: doc.title,
        slug: doc.slug,
        content: (doc.description ?? '').slice(0, CONTENT_CHAR_LIMIT)
      }
      const sections = sectionsFrom(doc.content ?? '')
        .filter((section) => section.content.length >= MIN_SECTION_LENGTH)
        .map<SearchRecord>((section) => ({
          id: `${doc.slug}#${section.slug}`,
          title: doc.title,
          slug: doc.slug,
          section: section.heading,
          sectionSlug: section.slug,
          content: section.content.slice(0, CONTENT_CHAR_LIMIT)
        }))
      return [page, ...sections]
    })
}
