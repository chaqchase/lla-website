import { docs } from '#site/content'

export interface NavItem {
  title: string
  href: string
  description?: string
}

export interface NavSection {
  key: string
  label: string
  /** Long sections start folded unless the current page lives inside them. */
  collapsible?: boolean
  items: NavItem[]
}

const SECTIONS: Array<Pick<NavSection, 'key' | 'label' | 'collapsible'>> = [
  { key: 'about', label: 'Start here' },
  { key: 'usage', label: 'Using lla' },
  { key: 'guides', label: 'Guides' },
  { key: 'plugins', label: 'Plugin platform' },
  { key: 'first-party-plugins', label: 'Plugin catalog', collapsible: true },
  { key: 'reference', label: 'Reference' },
  { key: 'support', label: 'Project' }
]

export function getDocsNav(): NavSection[] {
  const published = docs.filter((doc) => doc.published)

  return SECTIONS.map(({ key, label, collapsible }) => ({
    key,
    label,
    collapsible,
    items: published
      .filter((doc) => doc.slug.split('/')[1] === key)
      .sort((a, b) => a.order - b.order)
      .map((doc) => ({ title: doc.title, href: `/${doc.slug}`, description: doc.description }))
  })).filter((section) => section.items.length > 0)
}

/** Reading order across the docs, used for the previous and next links. */
export function getNeighbours(href: string) {
  const flat = getDocsNav().flatMap((section) => section.items.map((item) => ({ ...item, section: section.label })))
  const index = flat.findIndex((item) => item.href === href)
  return {
    section: flat[index]?.section,
    previous: index > 0 ? flat[index - 1] : undefined,
    next: index >= 0 && index < flat.length - 1 ? flat[index + 1] : undefined
  }
}
