import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { rollup_base_options } from "./vite.rollup";
import mkcert from "vite-plugin-mkcert";

// https://vitejs.dev/config/
export default defineConfig(cli => ({
  // base: "/", // must comply with assets dir in build config
  base:cli.command === "build" ? "/" : "", // must comply with assets dir in build config
  build: {
    outDir: "build",
    emptyOutDir: true,
    assetsDir: "",
    rollupOptions: rollup_base_options(),
  },
  server: {
    port: 5173,
    https: true,
  },
  preview: {
    port: 3000,
    https: true,
  },
  plugins: [mkcert(), react()],
}));
