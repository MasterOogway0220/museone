import { Head } from 'vite-react-ssg'

export default function NotFound() {
  return (
    <main className="notfound">
      <Head><title>Page not found | MuseOne</title><meta name="robots" content="noindex" /></Head>
      <p className="mono">Error 404</p>
      <h1>This page is not on our desk.</h1>
      <a className="btn" href="/">Back to the studio</a>
    </main>
  )
}
