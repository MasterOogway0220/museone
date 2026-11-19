import { useCallback, useEffect, useState } from 'react'
import { Head } from 'vite-react-ssg'
import ImpactLayer from './components/ImpactLayer'
import Loader from './components/Loader'
import Nav from './components/Nav'
import SpeedLines from './components/SpeedLines'
import { ScrollTrigger, startSmoothScroll } from './lib/motion'
import Crew from './scenes/Crew'
import Ending from './scenes/Ending'
import Episodes from './scenes/Episodes'
import PageDive from './scenes/PageDive'
import Production from './scenes/Production'
import Worlds from './scenes/Worlds'

const TITLE = 'MuseOne | Websites, web apps, mobile apps, SEO and social'
const DESCRIPTION = 'MuseOne is a three-person studio that designs and builds websites, web apps, and mobile and desktop apps, then runs the SEO and social media that bring people to them.'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'MuseOne',
  description: DESCRIPTION,
  makesOffer: ['Website design and development', 'Web application development', 'Mobile and desktop app development', 'Search engine optimisation', 'Social media marketing'].map((name) => ({
    '@type': 'Offer',
    itemOffered: { '@type': 'Service', name },
  })),
}

export default function Home() {
  const [ready, setReady] = useState(false)
  const onLoaded = useCallback(() => {
    setReady(true)
    ScrollTrigger.refresh() // fonts are in, so measure again
  }, [])

  useEffect(() => startSmoothScroll(), [])

  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Head>
      <a className="skip" href="#worlds">Skip to services</a>
      <Loader onDone={onLoaded} />
      <Nav />
      <main>
        <PageDive ready={ready} />
        <Worlds />
        <Production />
        <Episodes />
        <Crew />
        <Ending />
      </main>
      <SpeedLines />
      <ImpactLayer />
    </>
  )
}
