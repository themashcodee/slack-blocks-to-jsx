// Re-export the library's Tailwind config but extend `content` to also cover
// the library source (so edits in ../src/**/*.tsx generate the right utilities)
// and the playground's own source.
const libraryConfig = require("../tailwind.config.js");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...libraryConfig,
  content: [
    "../src/**/*.{js,ts,jsx,tsx,mdx}",
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};
