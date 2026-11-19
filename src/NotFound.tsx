import { Head } from 'vite-react-ssg'

export default function NotFound() {
  return (
    <main className="notfound">
      <Head><title>Episode not found | MuseOne</title><meta name="robots" content="noindex" /></Head>
      <p className="mono">ERROR 404 · MISSING FRAME</p>
      <h1>This episode was never drawn.</h1>
      <a className="btn-ink" href="/">Back to the first page</a>
    </main>
  )
}
