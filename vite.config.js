import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/fe-web-pemerintah/", // Sesuai dengan nama repo GitHub
});
