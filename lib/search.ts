import FlexSearch from 'flexsearch'
import type { SearchRecord } from './search-index'

export type { SearchRecord }

export interface SearchResult extends SearchRecord {
  score: number
}

const FIELD_WEIGHTS: Record<string, number> = { title: 6, section: 5, slug: 3, content: 2 }

/** Everyday pages come first, and the long handbook shouldn't crowd them out. */
const pageBoost = (slug: string) => {
  if (slug.startsWith('docs/usage/')) return 4
  if (slug === 'docs/about/architecture') return -2
  return 0
}

let records: SearchRecord[] | null = null
let index: any = null
let loading: Promise<void> | null = null

/** Fetches the index once, the first time the palette opens. */
export function loadSearchIndex(): Promise<void> {
  if (loading) return loading
  loading = fetch('/search-index.json')
    .then((response) => response.json())
    .then((data: SearchRecord[]) => {
      records = data
      index = new (FlexSearch as any).Document({
        tokenize: 'forward',
        cache: 200,
        document: {
          id: 'id',
          index: ['title', 'section', 'slug', 'content'],
          store: ['title', 'slug', 'section', 'sectionSlug', 'content']
        }
      })
      data.forEach((record) => index.add(record))
    })
    .catch((error) => {
      loading = null
      throw error
    })
  return loading
}

export function searchDocs(query: string, limit = 12): SearchResult[] {
  const normalized = query.trim()
  if (!index || normalized.length < 2) return []

  const aggregated = new Map<string, { doc: any; score: number; fields: Set<string> }>()
  const results = index.search(normalized, { limit: limit * 3, enrich: true, suggest: true })

  results.forEach((result: any) => {
    const field = typeof result.field === 'string' ? result.field : 'content'
    const weight = FIELD_WEIGHTS[field] ?? 1
    result.result.forEach((item: any) => {
      const doc = item.doc ? { ...item.doc, id: item.id } : item
      if (!doc?.id) return
      const existing = aggregated.get(doc.id)
      if (existing) {
        existing.score += weight
        existing.fields.add(field)
      } else {
        aggregated.set(doc.id, { doc, score: weight, fields: new Set([field]) })
      }
    })
  })

  const ranked = Array.from(aggregated.values())
    .map(({ doc, score, fields }) => ({
      id: doc.id,
      title: doc.title,
      slug: doc.slug,
      section: doc.section || undefined,
      sectionSlug: doc.sectionSlug || undefined,
      content: doc.content,
      score: score + fields.size * 0.25 + (doc.section ? 0.5 : -0.25) + pageBoost(doc.slug)
    }))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit)

  if (ranked.length > 0) return ranked

  const needle = normalized.toLowerCase()
  return (records ?? [])
    .filter((record) => `${record.title} ${record.section ?? ''} ${record.content}`.toLowerCase().includes(needle))
    .slice(0, limit)
    .map((record) => ({ ...record, score: 1 }))
}

const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** A short excerpt around the first match, with the matched terms wrapped in <mark>. */
export function highlightedSnippet(content: string, query: string, maxLength = 130): string {
  if (!content) return ''
  const words = query
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 1)
  const lower = content.toLowerCase()
  const first = words.map((word) => lower.indexOf(word)).filter((position) => position >= 0)
  const anchor = first.length > 0 ? Math.min(...first) : 0
  const start = Math.max(0, anchor - 40)
  const end = Math.min(content.length, start + maxLength)
  let snippet = escapeHtml(content.slice(start, end))
  if (start > 0) snippet = `…${snippet}`
  if (end < content.length) snippet = `${snippet}…`
  if (words.length === 0) return snippet
  const pattern = new RegExp(`(${words.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
  return snippet.replace(pattern, '<mark>$1</mark>')
}
