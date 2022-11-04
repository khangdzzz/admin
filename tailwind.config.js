/** @type {import('tailwindcss').Config} */
module.exports = {
  important:".tw",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#ffffff",
        dark: "#000000",
        primary: "#07a0b8",
        "primary-50": "#f0f8fa",
        "grey-1": "#eaeaea",
        "grey-2": "#f7f7f7",
        "grey-3": "#e8e8e8",
        "text-1": "#999999",
        "primary-400": "#07a0b8",
        "neutral-800": "#222222",
        "neutral-600": "#3c3c3c",
        "neutral-400": "#999999",
        "neutral-200": "#d7d7d7",
        "neutral-100": "#eaeaea",
        "neutral-50": "#f7f7f7",
        "neutral-0": "#ffffff",
        "red-1": "#f54e4e",
        "red-500": "#f54e4e",
        "primary-200": "#96dde9",
        "primary-100": "#e6f6f9",
        "blue-500": "#2F6BFF"
      },
      fontSize: {
        "2.5xl": ["1.75rem", "2.25rem"],
        base: ["1rem", "1.25rem"]
      }
    }
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
};
