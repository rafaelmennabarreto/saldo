/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        tertiary: "var(--color-tertiary)",
        "neutral-800": "var(--color-neutral-800)",
        "neutral-850": "var(--color-neutral-850)",
        "neutral-875": "var(--color-neutral-875)",
        "neutral-900": "var(--color-neutral-900)",
      },
    },
  },
  plugins: [],
};
