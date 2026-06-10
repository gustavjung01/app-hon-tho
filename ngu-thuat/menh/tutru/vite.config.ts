import { defineConfig } from "vite";

export default defineConfig({
  base: "/nguthuat/menh/tutru/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  esbuild: {
    jsx: "automatic",
  },
});
