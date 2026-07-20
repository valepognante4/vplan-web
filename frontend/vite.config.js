import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // Evita que Vite cambie al puerto 5174 si el 5173 está ocupado (necesario para Google OAuth)
    // Proxy: reenvía todas las rutas /api/* al backend en el puerto 3000.
    // Esto elimina los errores de CORS en desarrollo.
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
