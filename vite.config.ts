import process from "process";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { checker } from "vite-plugin-checker";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// eslint-disable-next-line import/no-unused-modules
export default defineConfig({
  base: "./",
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
    checker({
      enableBuild: false,
      overlay: false,
      terminal: true,
      typescript: true,
      eslint: {
        lintCommand: "eslint src --ext .js,.jsx,.ts,.tsx",
        useFlatConfig: false,
      },
    }),
  ],
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 5 * 1024, // 5MB
    sourcemap: process.env.DEBUG === "true",
  },
});
