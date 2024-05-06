import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// eslint-disable-next-line import/no-unused-modules
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    nodePolyfills({
      include: ["stream", "util", "crypto", "vm"],
      globals: {
        Buffer: true,
      },
    }),
    react(),
  ],
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 5 * 1024, // 5MB
  },
});
