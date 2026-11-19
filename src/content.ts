// All site copy lives here. No em dashes in shipped copy (style rule).

export const chapters = [
  { id: 'page', no: '01', label: 'The Page' },
  { id: 'worlds', no: '02', label: 'Five Worlds' },
  { id: 'production', no: '03', label: 'Production Line' },
  { id: 'episodes', no: '04', label: 'Episodes' },
  { id: 'crew', no: '05', label: 'The Crew' },
  { id: 'ending', no: '06', label: 'Ending' },
] as const

export type WorldKind = 'web' | 'app' | 'native' | 'seo' | 'social'

export const worlds: { kind: WorldKind; jp: string; title: string; body: string; tags: string[]; sfx: string }[] = [
  {
    kind: 'web', jp: 'ウェブ', title: 'Websites', sfx: 'ドン',
    body: 'Marketing sites, portfolios and landing pages, designed from a blank page and built to load fast on a cheap phone.',
    tags: ['Design', 'Motion', 'CMS', 'Performance'],
  },
  {
    kind: 'app', jp: 'アプリ', title: 'Web apps', sfx: 'バン',
    body: 'Dashboards, portals and internal tools with real logins, real data and the edge cases thought through.',
    tags: ['React', 'APIs', 'Auth', 'Databases'],
  },
  {
    kind: 'native', jp: 'モバイル', title: 'Mobile & desktop apps', sfx: 'ズン',
    body: 'iOS, Android and desktop apps. One shared codebase when it fits the product, native when it does not.',
    tags: ['iOS', 'Android', 'Windows', 'macOS'],
  },
  {
    kind: 'seo', jp: '検索', title: 'SEO', sfx: 'ピン',
    body: 'Technical audits, site structure and content that search engines can read, so the right people find you.',
    tags: ['Audits', 'Core Web Vitals', 'Content', 'Local'],
  },
  {
    kind: 'social', jp: 'ソーシャル', title: 'Social media', sfx: 'ポン',
    body: 'Content calendars, short videos and posts drawn in the same style as your site, so the brand reads as one.',
    tags: ['Strategy', 'Reels', 'Design', 'Reporting'],
  },
]

export const steps = [
  { cut: '01', title: 'Storyboard', phase: 'Discovery', body: 'We learn the business, the audience and what the project must do. You get a written brief before anything is designed.' },
  { cut: '02', title: 'Key frames', phase: 'Design', body: 'The important screens and moments are drawn first. You approve the look while changes are still cheap.' },
  { cut: '03', title: 'In-betweens', phase: 'Build', body: 'Everything between the key frames gets built, in small pieces you can click through every week.' },
  { cut: '04', title: 'Compositing', phase: 'Test & launch', body: 'Phones, browsers, speed and accessibility get checked, then it goes live on your domain.' },
  { cut: '05', title: 'Broadcast', phase: 'SEO & growth', body: 'Search, social and updates keep it in front of people after launch day.' },
]

// TODO(user): replace with real names, roles and photos or portraits.
export const crew = [
  { sheet: '01', name: 'Member 01', role: 'Design & motion', move: 'Keyframe Strike', moveBody: 'Draws every screen and every transition before a line of code is written.' },
  { sheet: '02', name: 'Member 02', role: 'Engineering: web, apps, desktop', move: 'Clean In-between', moveBody: 'Builds it to load fast and keep working long after launch.' },
  { sheet: '03', name: 'Member 03', role: 'SEO & social', move: 'Broadcast Signal', moveBody: 'Gets the finished work found, in search results and in feeds.' },
]

export const serviceOptions = worlds.map((w) => w.title)
