import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    // proxy: {
    //   "/gambit": {
    //     target: "https://gambit.strangled.net",
    //     changeOrigin: true,
    //     secure: true,
    //   },
    // },
  },
});
