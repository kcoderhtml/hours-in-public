// @ts-check
import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

import icon from "astro-icon";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({ applyBaseStyles: false }),
    icon({
      include: {
        mdi: ["heart", "file-document-box"],
      },
    }),
  ],

  output: "server",
  adapter: netlify(),
});