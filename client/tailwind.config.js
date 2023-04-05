/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "theme-primary-500": "#1C1C1E",
        "theme-secondary-500": "#F9A602",
        "theme-gray-300": "#BFBFBF",
        "theme-gray-500": "#7F7F7F",
        "theme-red-500": "#BE4B3B",
      },
    },
  },
  plugins: [],
};
