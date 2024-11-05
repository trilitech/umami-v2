import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import svgr from "vite-plugin-svgr";
import path from "path";
import sri from "vite-plugin-sri";

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
    sri({ algorithm: "sha384" }),
  ],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
        Buffer: "Buffer",
      },
    },
  },
  resolve: {
    alias: {
      "@umami/embed-iframe": path.resolve(__dirname, "../embed-iframe"),
    },
  },
});
