import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: process.env.BASE_PATH || "/",

  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",

      manifest: {
        name: "Loshy",
        short_name: "Loshy",
        description: "A little place made only for us.",

        theme_color: "#E87BAA",
        background_color: "#FFF9FB",

        display: "standalone",
        orientation: "portrait",

        start_url: "/",

        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        navigateFallback: null,
      },
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),

      "@assets": path.resolve(import.meta.dirname, "../../attached_assets"),
    },

    dedupe: ["react", "react-dom"],
  },

  root: path.resolve(import.meta.dirname),

  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),

    emptyOutDir: true,
  },

  server: {
    port: Number(process.env.PORT || 5173),
    host: "0.0.0.0",
  },

  preview: {
    port: Number(process.env.PORT || 5173),
    host: "0.0.0.0",
  },
});
