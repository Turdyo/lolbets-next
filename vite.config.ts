import solid from "solid-start/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [solid()],
  // resolve: {
  //   alias: {
  //     ".prisma/client/index-browser": "./node_modules/.prisma/client/index-browser.js"
  //   }
  // }
});
