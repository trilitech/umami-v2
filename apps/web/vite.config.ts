import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import svgr from "vite-plugin-svgr";
import sri from "vite-plugin-sri";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      include: "**/*.svg",
      svgrOptions: {
        plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
        prettier: false,
        titleProp: true,
        svgo: true,
        svgoConfig: {
          plugins: [
            {
              name: "preset-default",
              params: {
                overrides: { removeViewBox: false },
              },
            },
          ],
        },
      },
    }),
    nodePolyfills({
      include: ["stream", "util", "crypto", "vm"],
      globals: {
        Buffer: true,
      },
    }),
    sri({ algorithm: "sha384" }),
  ],
  build: {
    emptyOutDir: false,
  },
});
