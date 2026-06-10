import { defineConfig } from "vite";

export default defineConfig({
  base: "/nguthuat/y/yhoc/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  esbuild: {
    jsx: "automatic",
  },
});
