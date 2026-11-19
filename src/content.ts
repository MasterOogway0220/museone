// All site copy lives here. No em dashes in shipped copy (style rule).

export type ServiceId = 'web' | 'apps' | 'native' | 'seo' | 'social'

export const services: { id: ServiceId; title: string; body: string; tags: string[]; note: string }[] = [
  {
    id: 'web', title: 'Websites', note: 'built from a blank page',
    body: 'Marketing sites, portfolios and landing pages, designed from scratch and built to load fast on a cheap phone.',
    tags: ['Design', 'Development', 'CMS', 'Performance'],
  },
  {
    id: 'apps', title: 'Web apps', note: 'real data, real logins',
    body: 'Dashboards, portals and internal tools with real logins, real data and the edge cases thought through.',
    tags: ['React', 'APIs', 'Auth', 'Databases'],
  },
  {
    id: 'native', title: 'Mobile & desktop apps', note: 'one codebase when it fits',
    body: 'iOS, Android and desktop apps. One shared codebase when it fits the product, native when it does not.',
    tags: ['iOS', 'Android', 'Windows', 'macOS'],
  },
  {
    id: 'seo', title: 'SEO', note: 'found by the right people',
    body: 'Technical audits, site structure and content that search engines can read, so the right people find you.',
    tags: ['Audits', 'Core Web Vitals', 'Content', 'Local'],
  },
  {
    id: 'social', title: 'Social media marketing', note: 'same look, every channel',
    body: 'Content calendars, short videos and campaigns made in the same style as your site, so the brand reads as one.',
    tags: ['Strategy', 'Reels', 'Ads', 'Reporting'],
  },
]

export const steps = [
  { title: 'Discover', body: 'We learn the business, the audience and what the project must do. You get a written brief.' },
  { title: 'Design', body: 'Key screens first. You approve the look while changes are still cheap.' },
  { title: 'Build', body: 'Small pieces you can click through every week, not a big reveal at the end.' },
  { title: 'Launch', body: 'Phones, browsers, speed and accessibility checked, then live on your domain.' },
  { title: 'Grow', body: 'SEO, social and updates keep it in front of people after launch day.' },
]

// TODO(user): replace with real names, roles and photos.
export const crew = [
  { name: 'Member 01', role: 'Design & motion' },
  { name: 'Member 02', role: 'Engineering: web, apps, desktop' },
  { name: 'Member 03', role: 'SEO & social marketing' },
]

export const nav = [
  { id: 'services', label: 'Services' },
  { id: 'process', label: 'Process' },
  { id: 'team', label: 'Team' },
  { id: 'contact', label: 'Contact' },
]
