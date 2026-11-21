import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  // Root-hosted GitHub Pages portfolio; absolute assets work on case-study deep links.
  base: "/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Stable framework chunks improve caching without importing deferred sections early.
        manualChunks(id) {
          const modulePath = id.replace(/\\/g, "/");
          if (/\/node_modules\/(react|react-dom|scheduler)\//.test(modulePath)) return "react-vendor";
          if (/\/node_modules\/(framer-motion|motion-dom|motion-utils)\//.test(modulePath)) return "motion-vendor";
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
