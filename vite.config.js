import { defineConfig } from "vite";

export default defineConfig({
  // caminhos relativos: o build roda em qualquer pasta/host estático
  base: "./",
  build: {
    target: "es2022",
    cssMinify: true,
    sourcemap: false,
    chunkSizeWarningLimit: 300,
  },
  server: { host: "127.0.0.1", port: 5173 },
  preview: { host: "127.0.0.1", port: 4173 },
});
