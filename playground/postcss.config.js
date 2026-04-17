// Mirror the library's PostCSS pipeline so @apply / nesting / tailwind
// work the same way in the playground as they do in the published build.
// We intentionally skip cssnano here because Vite handles minification.
export default {
  plugins: {
    "tailwindcss/nesting": "postcss-nesting",
    tailwindcss: {},
    autoprefixer: {},
  },
};
