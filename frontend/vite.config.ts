import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/backend-kurswork/public/',
  plugins: [react()],
  build: {
    outDir: resolve(__dirname, '../build'),
    emptyOutDir: false,
    rollupOptions: {
      output: {
        entryFileNames: 'js/main.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.names && assetInfo.name?.endsWith('.css')) {
            return 'css/style.css';
          }
          return 'assets/[name].[ext]';
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost/backend-kurswork/public',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
