// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // o el plugin correspondiente si usas Vue, Svelte, etc.

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Puerto del frontend
    proxy: {
      // Cualquier solicitud a /api se redirigirá al backend
      "/api": {
        target: "http://localhost:3000", // Tu backend
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/api/, ''), // opcional, si quieres eliminar '/api'
      },
    },
  },
});
