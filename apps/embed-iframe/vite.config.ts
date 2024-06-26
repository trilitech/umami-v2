import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    svgr(),
    nodePolyfills({
      include: ["stream", "util", "crypto", "vm"],
      globals: {
        Buffer: true,
      },
    }),
  ],
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
    },
  },
});
