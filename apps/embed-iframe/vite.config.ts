import fs from "fs";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  base: "./",
  plugins: [
    copyVercelConfigPlugin(),
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
      define: {
        global: "globalThis",
        Buffer: "Buffer",
      },
    },
  },
});

function copyVercelConfigPlugin() {
  return {
    name: "copy-vercel-config",
    buildStart() {
      const network_environment = process.env.VITE_EMBED_ENVIRONMENT || "ghostnet";
      const vercelConfigFile =
        network_environment === "mainnet" ? "vercel.mainnet.json" : "vercel.ghostnet.json";
      fs.copyFileSync(vercelConfigFile, "vercel.json");
      console.log(`Copied ${vercelConfigFile} to vercel.json for network ${network_environment}`);
    },
  };
}
