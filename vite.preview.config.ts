import { defineConfig, mergeConfig } from 'vite'
import base from './vite.config.ts'

// Second build pass: adds the 3D world previews (preview.html) to dist/ next to the prerendered site.
export default mergeConfig(base, defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: { input: { preview: 'preview.html' } },
  },
}))
