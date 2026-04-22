import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },
  site: "https://slamoge.gl.fcen.uba.ar/",
  output: "static",
  trailingSlash: "always"
});
