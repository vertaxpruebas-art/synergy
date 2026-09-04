import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";

// Production config for Ámbar & Cuerda.
// output: "server" lets /admin and /api/* render per-request (auth, mutations)
// while the catalog page opts into static prerendering (see prerender export
// in src/pages/index.astro) so the product content ships fully indexable.
export default defineConfig({
  output: "server",
  adapter: vercel({
    webAnalytics: { enabled: false },
    imageService: true,
  }),
  integrations: [tailwind({ applyBaseStyles: false })],
  image: {
    // Default responsive breakpoints used by <Image> across the site.
    // See README "Fotografía" for the source-resolution brief.
    domains: [],
  },
  server: { port: 4321 },
});
