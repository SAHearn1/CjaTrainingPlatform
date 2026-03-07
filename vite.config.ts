import { defineConfig, type Plugin } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

/**
 * Resolves Figma Make's proprietary `figma:asset/<hash>.png` imports to a
 * 1×1 transparent PNG data URI so standard Vite builds succeed without the
 * Figma-hosted asset CDN. Components that need real images should replace
 * these imports with actual assets in public/ or src/assets/.
 */
function figmaAssetPlugin(): Plugin {
  const TRANSPARENT_PNG =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
  return {
    name: 'vite-plugin-figma-asset',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) return '\0figma-asset:' + id
    },
    load(id) {
      if (id.startsWith('\0figma-asset:')) return `export default "${TRANSPARENT_PNG}"`
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetPlugin(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
