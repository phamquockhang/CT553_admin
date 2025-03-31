import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  define: {
    global: "window", // Fix lỗi "global is not defined"
  },
  plugins: [react()],
  server: {
    host: true,
    port: 5000,
  },
});
