/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandGreen: {
          DEFAULT: "#004d00",
          600: "#005a00",
          700: "#004400",
        },
        brandYellow: {
          DEFAULT: "#ffd200",
          500: "#ffd200",
          600: "#f5c400",
        },
      },
    },
  },
  plugins: [],
}