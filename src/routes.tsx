import type { RouteRecord } from 'vite-react-ssg'
import Home from './Home'
import NotFound from './NotFound'

export const routes: RouteRecord[] = [
  { path: '/', element: <Home />, entry: 'src/Home.tsx' },
  { path: '*', element: <NotFound />, entry: 'src/NotFound.tsx' },
]
