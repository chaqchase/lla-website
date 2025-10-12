import FlexSearch from 'flexsearch'
import GithubSlugger from 'github-slugger'
import { docs } from '@/.velite'

export interface SearchResult {
  id: string
  title: string
  description?: string
  slug: string
  section?: string
  sectionSlug?: string
  content: string
  score: number
}

const FIELD_WEIGHTS = {
  title: 6,
  section: 5,
  description: 3,
  content: 2,
  slug: 2,
  keywords: 3
} as const

const MIN_SECTION_LENGTH = 20
const CONTENT_CHAR_LIMIT = 8000

// Create a document index for comprehensive search
const documentIndex = new FlexSearch.Document({
  tokenize: 'forward',
  cache: 200,
  document: {
    id: 'id',
    index: ['title', 'section', 'description', 'content', 'slug', 'keywords'],
    store: ['title', 'description', 'slug', 'section', 'sectionSlug', 'content']
  }
})

// Helper to extract text from markdown/mdx
function extractText(markdown: string): string {
  if (!markdown) return ''
  
  return markdown
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove MDX components
    .replace(/<[A-Z]\w*[^>]*>/g, '')
    // Remove code blocks but keep inline code
    .replace(/```[\s\S]*?```/g, ' ')
    // Remove inline code markers but keep content
    .replace(/`([^`]+)`/g, '$1')
    // Remove images
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove markdown formatting
    .replace(/[*_~`#]/g, '')
    // Clean up whitespace
    .replace(/\s+/g, ' ')
    .trim()
}

// Helper to extract sections from markdown
function extractSections(markdown: string): { heading: string; content: string; slug: string }[] {
  if (!markdown) return []

  if (/<h[1-6][^>]*>/i.test(markdown)) {
    return extractSectionsFromHtml(markdown)
  }

  const sections: { heading: string; content: string; slug: string }[] = []
  const lines = markdown.split('\n')
  let currentHeading = ''
  let currentSlug = ''
  let currentContent: string[] = []
  const slugger = new GithubSlugger()
  
  for (const line of lines) {
    const headingMatch = line.match(/^#{1,6}\s+(.+)$/)
    if (headingMatch) {
      if (currentHeading) {
        sections.push({
          heading: currentHeading,
          slug: currentSlug,
          content: extractText(currentContent.join('\n'))
        })
      }
      const rawHeading = headingMatch[1]
      const slugOverride = rawHeading.match(/\{#([^}]+)\}/)
      currentHeading = rawHeading.replace(/\{#[^}]+\}/g, '').trim()
      currentSlug = slugOverride ? slugOverride[1] : slugger.slug(currentHeading)
      currentContent = []
    } else if (currentHeading) {
      currentContent.push(line)
    }
  }
  
  if (currentHeading) {
    sections.push({
      heading: currentHeading,
      slug: currentSlug,
      content: extractText(currentContent.join('\n'))
    })
  }
  
  return sections
}

function extractSectionsFromHtml(html: string): { heading: string; content: string; slug: string }[] {
  const sections: { heading: string; content: string; slug: string }[] = []
  const slugger = new GithubSlugger()
  const headingRegex = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi
  const matches: Array<{ index: number; end: number; heading: string; slug: string }> = []
  let match: RegExpExecArray | null

  while ((match = headingRegex.exec(html)) !== null) {
    const fullHeading = match[0]
    const headingText = extractText(fullHeading)
    const idMatch = fullHeading.match(/id="([^"]+)"/)
    const slug = idMatch ? idMatch[1] : slugger.slug(headingText)

    matches.push({
      index: match.index,
      end: match.index + fullHeading.length,
      heading: headingText,
      slug
    })
  }

  for (let i = 0; i < matches.length; i++) {
    const current = matches[i]
    const next = matches[i + 1]
    const contentStart = current.end
    const contentEnd = next ? next.index : html.length
    const sectionHtml = html.slice(contentStart, contentEnd)
    const sectionContent = extractText(sectionHtml)

    sections.push({
      heading: current.heading,
      slug: current.slug,
      content: sectionContent
    })
  }

  return sections
}

function truncateText(value: string): string {
  if (!value) return ''
  return value.length > CONTENT_CHAR_LIMIT ? value.slice(0, CONTENT_CHAR_LIMIT) : value
}

type DocEntry = (typeof docs)[number]

function buildKeywords(doc: DocEntry): string {
  const keywords = new Set<string>()

  keywords.add(doc.slug)

  if ('slugAsParams' in doc && doc.slugAsParams) {
    keywords.add(doc.slugAsParams)
  }

  if (doc.references?.length) {
    doc.references.forEach((ref) => keywords.add(ref))
  }

  if (doc.status) {
    keywords.add(doc.status)
  }

  return Array.from(keywords).filter(Boolean).join(' ')
}

// Build the search index
let indexBuilt = false

export function buildSearchIndex() {
  if (indexBuilt) return
  
  docs.forEach((doc) => {
    if (!doc.published) return
    
    // Extract sections from the document
    const sections = extractSections(doc.content || '')
    const baseContent = truncateText(extractText(doc.content || ''))
    const keywords = buildKeywords(doc)
    
    // Index the main document
    documentIndex.add({
      id: doc.slug,
      title: doc.title,
      description: doc.description || '',
      content: baseContent,
      slug: doc.slug,
      section: '',
      sectionSlug: '',
      keywords
    })
    
    // Index each section separately for better results
    sections.forEach((section) => {
      if (!section.heading || !section.slug) return
      if (section.content.length < MIN_SECTION_LENGTH) return

        documentIndex.add({
          id: `${doc.slug}#${section.slug}`,
          title: doc.title,
          description: section.heading,
          content: truncateText(section.content),
          slug: doc.slug,
          section: section.heading,
          sectionSlug: section.slug,
          keywords
        })
    })
  })
  
  indexBuilt = true
}

// Search function with relevance scoring
export function searchDocs(query: string, limit = 20): SearchResult[] {
  if (!indexBuilt) {
    buildSearchIndex()
  }
  
  if (!query || query.trim().length < 2) {
    return []
  }
  
  const normalizedQuery = query.trim()

  const results = documentIndex.search(normalizedQuery, {
    limit: limit * 3,
    enrich: true,
    // @ts-ignore - FlexSearch types are not perfect
    suggest: true
  })
  
  const aggregated = new Map<string, { doc: any; score: number; fields: Set<string> }>()
  
  // Process results from all fields
  results.forEach((result: any) => {
    const fieldName = typeof result.field === 'string' ? result.field : 'content'
    const fieldWeight = FIELD_WEIGHTS[fieldName as keyof typeof FIELD_WEIGHTS] ?? 1

    result.result.forEach((item: any) => {
      const doc = item.doc || item
      if (!doc?.id) return

      const existing = aggregated.get(doc.id)
      if (existing) {
        existing.score += fieldWeight
        existing.fields.add(fieldName)
      } else {
        aggregated.set(doc.id, {
          doc,
          score: fieldWeight,
          fields: new Set([fieldName])
        })
      }
    })
  })
  
  const indexedResults = Array.from(aggregated.values())
    .map(({ doc, score, fields }) => {
      const fieldBonus = fields.size * 0.25
      const sectionBonus = doc.section ? 0.75 : -0.35
      const finalScore = score + fieldBonus + sectionBonus

      return {
        id: doc.id,
        title: doc.title,
        description: doc.description,
        slug: doc.slug,
        section: doc.section || undefined,
        sectionSlug: doc.sectionSlug || undefined,
        content: doc.content,
        score: finalScore
      } satisfies SearchResult
    })
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit)

  if (indexedResults.length > 0) {
    return indexedResults
  }

  return fallbackSearch(normalizedQuery, limit)
}

function fallbackSearch(query: string, limit: number): SearchResult[] {
  const results: SearchResult[] = []
  const seen = new Set<string>()
  const normalized = query.toLowerCase()

  for (const doc of docs) {
    if (!doc.published) continue

    const baseContent = extractText(doc.content || '')
    const haystack = [
      doc.title,
      doc.description,
      doc.slug,
      'slugAsParams' in doc ? doc.slugAsParams : '',
      doc.status,
      doc.references?.join(' '),
      baseContent
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    if (haystack.includes(normalized) && !seen.has(doc.slug)) {
      seen.add(doc.slug)
      results.push({
        id: doc.slug,
        title: doc.title,
        description: doc.description,
        slug: doc.slug,
        section: undefined,
        sectionSlug: undefined,
        content: truncateText(baseContent),
        score: 1
      })
    }

    if (results.length >= limit) break

    const sections = extractSections(doc.content || '')
    for (const section of sections) {
      if (!section.heading || !section.slug) continue

      const sectionHaystack = [section.heading, section.content]
        .join(' ')
        .toLowerCase()

      if (sectionHaystack.includes(normalized) && !seen.has(`${doc.slug}#${section.slug}`)) {
        seen.add(`${doc.slug}#${section.slug}`)
        results.push({
          id: `${doc.slug}#${section.slug}`,
          title: doc.title,
          description: section.heading,
          slug: doc.slug,
          section: section.heading,
          sectionSlug: section.slug,
          content: truncateText(section.content),
          score: 1.5
        })
      }

      if (results.length >= limit) break
    }

    if (results.length >= limit) break
  }

  return results.slice(0, limit)
}

// Get highlighted snippet around the match
export function getHighlightedSnippet(content: string, query: string, maxLength = 150): string {
  if (!content || !query) return ''
  
  const lowerContent = content.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 2)
  
  // Find the first occurrence of any query word
  let bestIndex = -1
  for (const word of queryWords) {
    const index = lowerContent.indexOf(word)
    if (index !== -1 && (bestIndex === -1 || index < bestIndex)) {
      bestIndex = index
    }
  }
  
  if (bestIndex === -1) {
    // No match found, return beginning
    return content.slice(0, maxLength) + (content.length > maxLength ? '...' : '')
  }
  
  // Calculate snippet bounds
  const start = Math.max(0, bestIndex - Math.floor(maxLength / 2))
  const end = Math.min(content.length, start + maxLength)
  
  let snippet = content.slice(start, end)
  
  // Add ellipsis
  if (start > 0) snippet = '...' + snippet
  if (end < content.length) snippet = snippet + '...'
  
  return snippet
}

// Highlight matching terms in text
export function highlightMatches(text: string, query: string): string {
  if (!text || !query) return text
  
  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 1)
  let highlighted = text
  
  queryWords.forEach(word => {
    const regex = new RegExp(`(${word})`, 'gi')
    highlighted = highlighted.replace(regex, '<mark>$1</mark>')
  })
  
  return highlighted
}
