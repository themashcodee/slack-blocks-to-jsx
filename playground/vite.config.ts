import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Alias the package name to the library source so edits in ../src hot-reload
// instantly in the playground without any build step.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "slack-blocks-to-jsx": path.resolve(__dirname, "../src/index.ts"),
    },
  },
  server: {
    fs: {
      // Allow Vite to serve files from the parent library folder (../src, ../test-blocks).
      allow: [path.resolve(__dirname, "..")],
    },
    port: 5173,
  },
});
