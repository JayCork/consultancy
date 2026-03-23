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
});
