import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Reenvía todas las rutas desconocidas al index.html (SPA fallback)
    historyApiFallback: true,
  },
})
