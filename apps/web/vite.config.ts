import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  server: {
    port: 3000, // web app runs here
    proxy: {
      "/api": {
        target: "http://localhost:5173", // API runs here
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    // Exclude workspace packages from pre-bundling so Vite watches their
    // source files directly and HMR picks up changes without a restart.
    exclude: ["@consultancy/ui", "@consultancy/db"],
  },
});
