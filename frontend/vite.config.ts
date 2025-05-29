import path from "path";
// import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  // plugins: [react(), tailwindcss()],
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      buffer: "buffer",
    },
  },
  server: {
    port: 3000
  },
  optimizeDeps: {
    include: ["music-metadata-browser", "buffer"]
  }
})
