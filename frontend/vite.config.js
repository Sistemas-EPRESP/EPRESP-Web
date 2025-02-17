// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // o el plugin correspondiente si usas Vue, Svelte, etc.

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permite que el servidor sea accesible externamente
    port: 5173,      // Puedes especificar el puerto que prefieras
    proxy: {
      '/api': {
        target: 'http://192.168.0.151:3000', // URL del backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
