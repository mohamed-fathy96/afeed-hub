import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@app", replacement: path.resolve(__dirname, "src") },
      { find: "jsts", replacement: "jsts/dist/jsts.min.js" },
    ],
  },
  define: {
    // Provide environment variables to your Vite app
  },
});
