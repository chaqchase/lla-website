export const siteConfig = {
  name: 'lla',
  url: 'https://lla.chaqchase.com',
  version: '0.8.0',
  description:
    'lla is an ls replacement written in Rust. Trees, tables, timelines, size maps, Git status, a fuzzy finder, disk cleanup, content search, machine-readable output and plugins, from one binary.',
  author: 'chaqchase',
  links: {
    twitter: 'https://twitter.com/chaqchase',
    github: 'https://github.com/chaqchase',
    repo: 'https://github.com/chaqchase/lla',
    releases: 'https://github.com/chaqchase/lla/releases',
    editBase: 'https://github.com/chaqchase/lla-website/edit/main/content/',
    personalSite: 'https://chaqchase.com'
  }
}

export type SiteConfig = typeof siteConfig
