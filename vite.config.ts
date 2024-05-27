import process from "process";

import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { checker } from "vite-plugin-checker";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// eslint-disable-next-line import/no-unused-modules
export default ({ mode }: { mode: "development" | "production" }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  // Note: you need to put those variables into a .env file in the root of the project
  // in order to control the checker behaviour
  const enableChecker =
    env.VITE_DISABLE_DEV_CHECKS !== "true" &&
    (env.VITE_DISABLE_TYPESCRIPT_CHECK !== "true" || env.VITE_DISABLE_ESLINT_CHECK === "true");

  return defineConfig({
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
      enableChecker &&
        checker({
          enableBuild: false,
          overlay: env.VITE_ENABLE_CHECKS_OVERLAY === "true",
          terminal: true,
          typescript: env.VITE_ENABLE_TYPESCRIPT_CHECK === "true",
          eslint: env.VITE_ENABLE_ESLINT_CHECK !== "true" && {
            lintCommand: "eslint src --ext .js,.jsx,.ts,.tsx",
            useFlatConfig: false,
          },
        }),
    ].filter(Boolean),
    build: {
      outDir: "build",
      chunkSizeWarningLimit: 5 * 1024, // 5MB
      sourcemap: env.DEBUG === "true",
    },
  });
};
