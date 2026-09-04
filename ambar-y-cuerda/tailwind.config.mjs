/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        ink: "#1c1712",
        card: "#241f18",
        "card-2": "#2b241b",
        brass: "#c9a24b",
        "brass-dim": "#8f7530",
        sage: "#7c8a6a",
        rust: "#b0563f",
        bone: "#efe7d8",
        "bone-dim": "#b8ac97",
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        sans: ["Public Sans", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      borderColor: {
        line: "rgba(239,231,216,0.16)",
      },
    },
  },
  plugins: [],
};
